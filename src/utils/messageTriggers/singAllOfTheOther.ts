import wait from "../wait.js";
import { Message } from "discord.js";

async function singAllOfTheOther(message: Message) {
  const allOfTheOtherTriggerWords = ["rudolph", "olive", "%christmassong2"];

  if (
    allOfTheOtherTriggerWords.some((word) => message.content.toLowerCase().includes(word.toLowerCase())) &&
    message.channel.isSendable()
  ) {
    await message.channel.send("Rudolph the red-nosed reindeer");
    await wait(2);
    await message.channel.send("Had a very shiny nose");
    await wait(2);
    await message.channel.send("And if you ever saw it");
    await wait(2);
    await message.channel.send("You could even say it glows");
    await wait(3);
    await message.channel.send("https://i.redd.it/at5vtj2jt4731.jpg");
    await wait(1);
    await message.channel.send("Olive, the other reindeer");
  }
}

export default singAllOfTheOther;
