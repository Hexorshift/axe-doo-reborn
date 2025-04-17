import { CronJob } from "cron";
import { Client } from "discord.js";

const greetings = (client: Client) => {
  const servers = [
    { serverId: "760697375949324308", channelId: "821035578240794644" },
    { serverId: "1317642142847336448", channelId: "1330017554604757114" }
  ];
  const greetings = [
    { name: "Good Morning", time: "0 8 * * *", message: "Good Morning chat 🌞" },
    { name: "Good Afternoon", time: "0 12 * * *", message: "Good Afternoon chat 🌤️" },
    { name: "Good Night", time: "0 22 * * *", message: "Good Night chat 🌙" }
  ];

  for (const server of servers) {
    const channel = client.guilds.cache.get(server.serverId)!.channels.cache.get(server.channelId);

    if (channel) {
      for (const greeting of greetings) {
        const job = new CronJob(
          greeting.time,
          async function () {
            if (channel.isSendable()) {
              await channel.send(greeting.message);
            }
          },
          null,
          true,
          "America/New_York"
        );
      }
    } else {
      const guild = client.guilds.cache.get(server.serverId);

      console.log(`Failed to schedule greetings job for ${guild?.name} :(`);
    }
  }

  console.log(`Greetings job is running for ${servers.length} servers!`);
};

export default greetings;
