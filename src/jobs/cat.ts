import { CronJob } from "cron";
import { Client } from "discord.js";

const cat = (client: Client) => {
  const servers = [
    { serverId: "760697375949324308", channelId: "768530082271592508" },
    { serverId: "1317642142847336448", channelId: "1330017554604757114" },
    { serverId: "893905505544704020", channelId: "893905505544704024" }
  ];

  for (const server of servers) {
    const channel = client.guilds.cache.get(server.serverId)!.channels.cache.get(server.channelId);

    if (channel) {
      const job = new CronJob(
        "0 0 19 * *",
        async function () {
          if (channel.isSendable()) {
            await channel.send(
              "https://media.discordapp.net/attachments/855268214598664212/1120446809400152146/cat-kitty.mov"
            );
          }
        },
        null,
        true,
        "America/New_York"
      );
    } else {
      const guild = client.guilds.cache.get(server.serverId);

      console.log(`Failed to schedule cat job for ${guild?.name} :(`);
    }
  }

  console.log(`Cat job is running for ${servers.length} servers!`);
};

export default cat;
