import IEvent from "./interfaces/IEvent";
import ICommand from "./interfaces/ICommand";
import { Client, GatewayIntentBits, Collection, Partials } from "discord.js";
import { readdirpPromise } from "readdirp";

class AxeDoo extends Client {
  private commands: Collection<string, ICommand>;
  public trackedUserIds: string[];
  public activeStates: Map<any, any>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
      ],
      partials: [Partials.Channel, Partials.Message]
    });
    this.commands = new Collection();
    this.trackedUserIds = ["526449871671001098"];
    this.activeStates = new Map();
  }

  getCommands() {
    return this.commands;
  }

  async loadEvents() {
    const files = await readdirpPromise("src/events");

    for (const file of files) {
      const { default: event }: { default: IEvent } = await import(file.fullPath);

      this[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
    }

    console.log(`Loaded ${files.length} events.`);
  }

  async loadCommands() {
    const files = await readdirpPromise("src/commands");

    for (const file of files) {
      const { default: command }: { default: ICommand } = await import(file.fullPath);

      this.commands.set(command.data.name, command);
      if (command.modalCustomId) this.commands.set(command.modalCustomId, command);
    }

    console.log(`Loaded ${this.commands.size} commands.`);
  }
}

export default new AxeDoo();
