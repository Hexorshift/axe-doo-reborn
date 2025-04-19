import IEvent from "../interfaces/IEvent";
import triggerWords from "../utils/messageTriggers/triggerWords";
import singAllIWantFor from "../utils/messageTriggers/singAllIWantFor";
import singAllOfTheOther from "../utils/messageTriggers/singAllOfTheOther";
import superagent from "superagent";
import { Events, Message } from "discord.js";

const ready: IEvent<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || message.channel.isDMBased()) return;

    if (message.channel.isSendable()) {
      await singAllIWantFor(message);
      await singAllOfTheOther(message);

      for (const key in triggerWords) {
        if (message.content.toLowerCase().includes(key)) {
          await message.channel.send(triggerWords[key]);
        }
      }

      if (message.mentions.users.has(message.client.user.id)) {
        let content = message.content;
        message.mentions.users.forEach((user) => {
          const mention = `<@${user.id}>`;
          const mentionWithNickname = `<@!${user.id}>`;

          content = content.replaceAll(mention, `@${user.username}`);
          content = content.replaceAll(mentionWithNickname, `@${user.username}`);
        });

        await message.channel.sendTyping();

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
          const choice = response.body.choices[0];

          if (message.channel.isSendable()) message.reply(choice.message.content);
        } catch (error: unknown) {
          console.log(error);
          if (error instanceof Error) message.reply(error.message);
        }
      }
    }
  }
};

export default ready;
