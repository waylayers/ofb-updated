import { awaitEvent } from "../events/owoMessages.js";
import waitRandomDelay from "../functions/wait.js";
import Selfbot from "../structures/client.js";

export default async function checkInventory(selfbot: Selfbot) {
  if (!selfbot.safeToUseCommand || !selfbot.config.settings.inventory.check)
    return;
  selfbot.status.doingCommand = true;
  await waitRandomDelay(3000);
  selfbot.logger.info("🔁 [Inventory] Checking inventory...");
  await selfbot.owoCommand("inv");
  await awaitEvent("inventory");
  selfbot.status.info.inventoryChecks++;
}
