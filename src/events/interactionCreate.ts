import AxeDoo from "../AxeDoo";
import IEvent from "../interfaces/IEvent";
import {
  InteractionType,
  Events,
  BaseInteraction,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ModalSubmitInteraction
} from "discord.js";

const interactionCreate: IEvent<typeof Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: BaseInteraction) {
    const client = interaction.client as typeof AxeDoo;

    try {
      // Chat input or context menu command
      if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = client.getCommands().get(interaction.commandName);

        if (!command || typeof command.execute !== "function") {
          await interaction.reply({ content: "This command doesn't exist.", ephemeral: true });
          return;
        }

        await command.execute(interaction as ChatInputCommandInteraction);
      }

      // Autocomplete interaction
      else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        const auto = interaction as AutocompleteInteraction;
        const command = client.getCommands().get(auto.commandName);

        if (command && typeof command.suggestions === "function") {
          await command.suggestions(auto);
        }
      }

      // Modal submission
      else if (interaction.type === InteractionType.ModalSubmit) {
        const modal = interaction as ModalSubmitInteraction;
        const command = client.getCommands().get(modal.customId);

        if (command && typeof command.modalResponse === "function") {
          await command.modalResponse(modal);
        }
      }
    } catch (error) {
      console.error(error);

      if (interaction.isRepliable()) {
        await interaction.reply({ content: "There was an error while executing this interaction!", ephemeral: true });
      }
    }
  }
};

export default interactionCreate;
