/* eslint-disable no-constant-condition */
import waitRandomDelay from "../functions/wait.js";
import Selfbot from "../structures/client.js";
import farmBattle from "./battle.js";
import { checklist } from "./checklist.js";
import farmHunt from "./hunt.js";

export default async function farm(selfbot: Selfbot) {
  if (!selfbot.mainChannel?.isText() && !selfbot.paused)
    throw new Error("Main channel is not text based or it doesn't exist");
  await checklist(selfbot);
  while (true) {
    await waitRandomDelay(18000);
    if (selfbot.safeToUseCommand) {
      farmHunt(selfbot);
      farmBattle(selfbot);
    }
  }
}
