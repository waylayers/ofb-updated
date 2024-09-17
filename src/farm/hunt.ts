import { awaitEvent } from "../events/owoMessages.js";
import Selfbot from "../structures/client.js";

export default async function farmHunt(selfbot: Selfbot) {
  if (!selfbot.safeToUseCommand || !selfbot.config.commands.hunt) return;
  selfbot.status.doingCommand = true;
  selfbot.logger.info("🔁 [Hunt] Hunting...");
  await selfbot.owoCommand("h");
  await awaitEvent("hunt");
  return;
}
