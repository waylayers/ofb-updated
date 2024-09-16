import Selfbot from "../structures/client.js";

export default async function farmBattle(selfbot: Selfbot) {
  if (!selfbot.config.commands.battle) return;
  selfbot.status.doingCommand = true;
  await selfbot.owoCommand("b");
}
