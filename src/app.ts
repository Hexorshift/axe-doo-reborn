import AxeDoo from "./AxeDoo";
import deployCommands from "./deployCommands";
import { getVoiceConnection } from "@discordjs/voice";

async function main() {
  try {
    await deployCommands();
    await AxeDoo.loadCommands();
    await AxeDoo.loadEvents();
    await AxeDoo.login(process.env.BOT_TOKEN!);

    setupGracefulShutdown();

    Bun.serve({
      port: 3000,
      routes: {
        "/": new Response("Hello world!")
      }
    });
  } catch (error) {
    console.error("Bot failed to start:", error);
  }
}

async function cleanupVoiceConnections() {
  for (const [guildId] of AxeDoo.guilds.cache) {
    const connection = getVoiceConnection(guildId);
    if (connection) connection.destroy();
  }
}

function setupGracefulShutdown() {
  const shutdown = async () => {
    await cleanupVoiceConnections();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
