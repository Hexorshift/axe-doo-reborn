import IEvent from "../interfaces/IEvent";
import triggerWords from "../utils/messageTriggers/triggerWords";
import singAllIWantFor from "../utils/messageTriggers/singAllIWantFor";
import singAllOfTheOther from "../utils/messageTriggers/singAllOfTheOther";
import { Events, Message } from "discord.js";

const ready: IEvent<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;

    if (message.channel.isSendable()) {
      await singAllIWantFor(message);
      await singAllOfTheOther(message);

      for (const key in triggerWords) {
        if (message.content.toLowerCase().includes(key)) {
          await message.channel.send(triggerWords[key]);
        }
      }
    }
  }
};

export default ready;
