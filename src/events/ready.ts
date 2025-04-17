import greetings from "../jobs/greetings";
import cat from "../jobs/cat";
import randomInt from "../utils/randomInt";
import IEvent from "../interfaces/IEvent";
import { Events, Client, PresenceUpdateStatus, ActivityType } from "discord.js";

const ready: IEvent<typeof Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`${client.user?.username} lives again!`);

    // Schedule jobs
    greetings(client);
    cat(client);

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
    }, (1000 * 60) / 2);
  }
};

export default ready;
