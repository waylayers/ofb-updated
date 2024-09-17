/* eslint-disable no-constant-condition */
import { emitter } from "../events/owoMessages.js";
import waitRandomDelay from "../functions/wait.js";
import Selfbot from "../structures/client.js";
import farmBattle from "./battle.js";
import { checklist } from "./checklist.js";
import farmHunt from "./hunt.js";

export default async function farm(selfbot: Selfbot) {
  if (!selfbot.mainChannel?.isText() && !selfbot.paused)
    throw new Error("Main channel is not text based or it doesn't exist");
  await checklist(selfbot);
  emitter.on("checklist", () => (selfbot.status.info.checklistDone = true));
  emitter.on("hunt", () => selfbot.status.info.hunts++);
  emitter.on("inventory", () => selfbot.status.info.inventoryChecks++);
  emitter.on("randomPhrase", () => selfbot.status.info.randomPhrasesSent++);
  while (true) {
    await waitRandomDelay(18000);
    await farmHunt(selfbot).catch((err) => console.error(err));
    await waitRandomDelay(3500);
    farmBattle(selfbot).catch((err) => console.error(err));
  }
}
