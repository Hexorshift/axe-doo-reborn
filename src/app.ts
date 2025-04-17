import AxeDoo from "./AxeDoo";
import deployCommands from "./deployCommands";
import { config } from "dotenv";

config();

(async () => {
  try {
    await deployCommands();
    await AxeDoo.loadCommands();
    await AxeDoo.loadEvents();
    await AxeDoo.login(process.env.BOT_TOKEN!);
  } catch (error) {
    console.log(error);
  }
})();
