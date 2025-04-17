import wait from "../wait";
import { Message } from "discord.js";

async function singAllIWantFor(message: Message) {
  const allIWantForTriggerWords = ["all i want for christmas", "%christmassong1"];

  if (
    allIWantForTriggerWords.some((word) => message.content.toLowerCase().includes(word.toLowerCase())) &&
    message.channel.isSendable()
  ) {
    if (new Date().getMonth() >= 11) {
      await message.channel.send("I don't want a lot for Christmas");
      await wait(3);
      await message.channel.send("There is just one thing I need");
      await wait(3);
      await message.channel.send("I don't care about the presents");
      await wait(3);
      await message.channel.send("Underneath the Christmas tree");
      await wait(3);
      await message.channel.send("I just want you for my own");
      await wait(3);
      await message.channel.send("More than you could ever know");
      await wait(3);
      await message.channel.send("Make my wish come true");
      await wait(4);
      await message.channel.send("All I want for Christmas");
      await wait(4);
      await message.channel.send("is...");
      await wait(5);
      await message.channel.send(
        "https://media.istockphoto.com/photos/sheep-picture-id182344013?k=20&m=182344013&s=612x612&w=0&h=p88NXan9FWkXkB-4MGF9fVC5qQw5irmVhfOs4WZ-H1U="
      );
      await wait(1);
      await message.channel.send("e w e");
      await wait(0.5);
      await message.channel.send(
        ":musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard::musical_keyboard:"
      );
    } else {
      message.reply("It's not Christmas yet :(");
    }
  }
}

export default singAllIWantFor;
