import ICommand from "./interfaces/ICommand";
import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { config } from "dotenv";
import { readdirpPromise } from "readdirp";

config();

const deployCommands = async () => {
  try {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const rest = new REST().setToken(process.env.BOT_TOKEN!);
    const files = await readdirpPromise("dist/commands");

    for (const file of files) {
      const { default: command }: { default: ICommand } = await import(file.fullPath);

      commands.push(command.data.toJSON());
    }

    if (process.env.NODE_ENV !== "production") {
      await rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID!, process.env.BOT_SERVER_ID!), {
        body: commands
      });
    } else {
      await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID!), { body: commands });
    }

    console.log(
      `Successfully registered ${commands.length} application commands ${
        process.env.NODE_ENV !== "production" ? "to server" : "globally"
      }.`
    );
  } catch (error) {
    console.error(error);
  }
};

export default deployCommands;
