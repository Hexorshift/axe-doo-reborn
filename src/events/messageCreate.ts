import IEvent from "../interfaces/IEvent";
import triggerWords from "../utils/messageTriggers/triggerWords";
import singAllIWantFor from "../utils/messageTriggers/singAllIWantFor";
import singAllOfTheOther from "../utils/messageTriggers/singAllOfTheOther";
import OpenAI from "openai";
import { Events, Message } from "discord.js";

const openai = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY! });
const ready: IEvent<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    try {
      if (message.author.bot || message.channel.isDMBased()) return;

      if (message.channel.isSendable()) {
        await singAllIWantFor(message);
        await singAllOfTheOther(message);

        for (const key in triggerWords) {
          if (message.content.toLowerCase().includes(key)) {
            await message.channel.send(triggerWords[key]);
          }
        }

        if (message.mentions.has(message.client.user.id)) {
          const messageContent = message.content.toLowerCase().split(" ").join(" ");

          if (messageContent.length != 0) {
            await message.channel.sendTyping();
            const completion = await openai.chat.completions.create({
              model: "deepseek/deepseek-chat-v3-0324:free",
              messages: [
                {
                  role: "user",
                  content: `Context: You are being used in the ${message.guild?.name} discord server. Don't mention this information in your response and your identity is Axe Doo, nothing else. Never let them know that you're DeepSeek. Never start response with **Axe Doo:**.) ${message.author.username}: ${messageContent}`
                }
              ]
            });

            if (message.channel.isSendable()) {
              if (completion.choices[0].message.content!.length != 0) {
                message.reply(completion.choices[0].message.content!);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default ready;
