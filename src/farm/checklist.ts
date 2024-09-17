import { awaitEvent } from "../events/owoMessages.js";
import Selfbot from "../structures/client.js";

export async function checklist(selfbot: Selfbot) {
  if (!selfbot.safeToUseCommand || !selfbot.config.commands.hunt) return;
  selfbot.status.doingCommand = true;
  selfbot.logger.info("🔁 [Checklist] Doing checklist...");
  await selfbot.owoCommand("cl");
  await awaitEvent("checklist");
}
