import farm from "../farm/index.js";
import SelfbotEvent from "../structures/event.js";

export default new SelfbotEvent({
  name: "ready",
  async run(selfbot) {
    if (!selfbot.mainChannel) throw new Error("Main channel does not exist");
    selfbot.logger.info(`Connected as ${selfbot.user?.tag}`);
    if (selfbot.config.settings.autoStart && !selfbot.status.started) {
      farm(selfbot);
    }
    selfbot.updateRPC();
  },
});
