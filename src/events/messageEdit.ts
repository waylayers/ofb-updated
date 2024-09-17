import SelfbotEvent from "../structures/event.js";
import { emitter } from "./owoMessages.js";
let lastBattle: number | null = null;
export default new SelfbotEvent({
  name: "messageUpdate",
  async run(selfbot, oldMessage, newMessage) {
    if (newMessage.author?.id !== "408785106942164992") return;
    const battle = async () => {
      if (!newMessage.embeds[0]?.author?.name.includes("goes into battle!"))
        return;
      if (lastBattle && Date.now() <= lastBattle + 2000) return;
      if (newMessage.embeds[0].footer?.text.includes("You lost")) {
        selfbot.logger.info("⭕ [Battle] Lost battle");
        selfbot.status.info.battles.lost++;
      }
      if (newMessage.embeds[0].footer?.text.includes("You won")) {
        selfbot.logger.info("✅ [Battle] Won battle");
        selfbot.status.info.battles.won++;
      }
      lastBattle = Date.now();
      selfbot.status.doingCommand = false;
      emitter.emit("battle");
    };
    battle();
  },
});
