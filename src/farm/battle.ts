import { awaitEvent } from "../events/owoMessages.js";
import waitRandomDelay from "../functions/wait.js";
import Selfbot from "../structures/client.js";

export default async function farmBattle(selfbot: Selfbot) {
  if (selfbot.paused || !selfbot.config.commands.battle) return;
  if (!selfbot.safeToUseCommand) await waitRandomDelay(2500);
  selfbot.status.doingCommand = true;
  selfbot.logger.info("🔁 [Battle] Battling...");
  await selfbot.owoCommand("b");
  await awaitEvent("battle");
}
