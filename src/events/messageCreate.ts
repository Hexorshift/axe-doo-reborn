import IEvent from "../interfaces/IEvent";
import triggerWords from "../utils/messageTriggers/triggerWords";
import singAllIWantFor from "../utils/messageTriggers/singAllIWantFor";
import singAllOfTheOther from "../utils/messageTriggers/singAllOfTheOther";
import superagent from "superagent";
import AxeDoo from "../AxeDoo";
import googleTTS from "google-tts-api";
import { Events, Message } from "discord.js";
import { createAudioResource, StreamType } from "@discordjs/voice";

const playNext = (guildId: string) => {
  const state = AxeDoo.activeStates.get(guildId);

  if (!state || state.queue.length === 0) {
    if (state) state.isPlaying = false;
    return;
  }

  state.isPlaying = true;

  const nextResource = state.queue.shift()!;

  state.player.play(nextResource);
  state.player.once("idle", () => playNext(guildId));
};

const handleTTS = async (message: Message, text: string, guildId: string) => {
  const state = AxeDoo.activeStates.get(guildId);
  if (!state) return;

  try {
    const url = googleTTS.getAudioUrl(text, { lang: "en", slow: false, host: "https://translate.google.com" });
    const resource = createAudioResource(url, { inputType: StreamType.Arbitrary });

    if (!state.queue) state.queue = [];
    if (typeof state.isPlaying !== "boolean") state.isPlaying = false;

    state.queue.push(resource);
    if (!state.isPlaying) playNext(guildId);
  } catch (err) {
    console.error(err);
  }
};

const handleTriggers = async (message: Message) => {
  await singAllIWantFor(message);
  await singAllOfTheOther(message);

  const contentLower = message.content.toLowerCase();
  for (const key in triggerWords) {
    if (contentLower.includes(key)) {
      if (message.channel.isSendable()) {
        await message.channel.send(triggerWords[key]);
      }
    }
  }
};

const handleMentionReply = async (message: Message) => {
  let content = message.content;

  message.mentions.users.forEach((user) => {
    const mention = `<@${user.id}>`;
    const mentionWithNickname = `<@!${user.id}>`;

    content = content.replaceAll(mention, `@${user.username}`);
    content = content.replaceAll(mentionWithNickname, `@${user.username}`);
  });

  if (message.channel.isSendable()) {
    await message.channel.sendTyping();
  }

  try {
    const response = await superagent
      .post("https://llm.chutes.ai/v1/chat/completions")
      .set("Authorization", `Bearer ${process.env.CHUTES_AI_API_KEY!}`)
      .set("Content-Type", "application/json")
      .send({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: `Context: You are being used in the ${message.guild?.name} discord server. Don't mention this information in your response and your identity is Axe Doo, nothing else. Never let them know that you're DeepSeek. Never start response with **Axe Doo:**.) ${message.author.username}: ${content}`
          }
        ],
        stream: false,
        max_tokens: 1024,
        temperature: 0.7
      });
    const reply = response.body.choices?.[0]?.message?.content;

    if (reply && message.channel.isSendable()) {
      await message.reply(reply);
    }
  } catch (error) {
    if (error instanceof Error) await message.reply("Something went wrong :(");
  }
};

const messageCreateEvent: IEvent<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || !message.content || !AxeDoo.trackedUserIds.includes(message.author.id)) {
      return;
    }

    const guildId = message.guild?.id || [...AxeDoo.activeStates.keys()][0];

    if (message.guild) {
      if (!guildId || !AxeDoo.activeStates.has(guildId)) return;

      const guildMember = await message.guild.members.fetch(message.author.id).catch(() => null);
      if (!guildMember) return;

      if (!guildMember.voice || (!guildMember.voice.serverMute && !guildMember.voice.selfMute)) {
        return;
      }

      await handleTTS(message, message.content, guildId);
    } else {
      if (!guildId || !AxeDoo.activeStates.has(guildId)) return;

      await handleTTS(message, message.content, guildId);
    }

    if (message.channel.isSendable()) {
      await handleTriggers(message);

      if (message.mentions.users.has(message.client.user.id)) {
        await handleMentionReply(message);
      }
    }
  }
};

export default messageCreateEvent;
