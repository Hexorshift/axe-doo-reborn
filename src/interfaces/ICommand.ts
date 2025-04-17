import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder
} from "discord.js";

export default interface ICommand {
  data: SlashCommandBuilder;
  modalCustomId?: string;
  suggestions?: (interaction: AutocompleteInteraction) => Promise<void>;
  modalResponse?: (interaction: ModalSubmitInteraction) => Promise<void>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
