import ICommand from "../../interfaces/ICommand";
import { SlashCommandBuilder } from "discord.js";

const ping: ICommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("The bot replies with pong!")
    .setNameLocalization("ja", "ピング"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  }
};

export default ping;
