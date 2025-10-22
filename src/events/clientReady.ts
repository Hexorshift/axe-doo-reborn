import greetings from "../jobs/greetings";
import cat from "../jobs/cat";
import randomInt from "../utils/randomInt";
import IEvent from "../interfaces/IEvent";
import AxeDoo from "../AxeDoo";
import switchVoiceChannel from "../utils/switchVoiceChannel";
import { Events, Client, PresenceUpdateStatus, ActivityType, ChannelType } from "discord.js";

const clientReady: IEvent<typeof Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`${client.user?.username} lives again!`);

    // Schedule jobs
    greetings(client);
    cat(client);

    // Set initial presence
    client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);

    const activities = [
      { name: "over migu and pepo", type: ActivityType.Watching },
      { name: "Miku", type: ActivityType.Listening },
      { name: "Fortnite", type: ActivityType.Playing },
      { name: "Marvel Rivals", type: ActivityType.Playing },
      { name: "with Axe", type: ActivityType.Playing },
      { name: "with Hexorshift", type: ActivityType.Playing },
      { name: "Anime", type: ActivityType.Watching }
    ];

    setInterval(() => {
      client.user?.setActivity(activities[randomInt(0, activities.length - 1)]);
    }, 30_000); // Every 30 seconds

    // Join any voice channels with tracked TTS users on startup
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const voiceChannel = guild.channels.cache.find((channel) => {
          if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice) {
            return channel.members.some((member) => AxeDoo.trackedUserIds.includes(member.id) && !member.user.bot);
          }
          return false;
        });

        if (voiceChannel) {
          await switchVoiceChannel(guildId, voiceChannel.id, guild);
        }
      } catch (err) {}
    }
  }
};

export default clientReady;
