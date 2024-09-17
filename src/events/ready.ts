import farm from "../farm/index.js";
import SelfbotEvent from "../structures/event.js";

export default new SelfbotEvent({
  name: "ready",
  async run(selfbot) {
    if (!selfbot.mainChannel) throw new Error("Main channel does not exist");
    selfbot.logger.info(`✅ Connected as ${selfbot.user?.tag}`);
    if (selfbot.config.settings.autoStart && !selfbot.status.started) {
      farm(selfbot);
    } else {
      selfbot.logger.info(
        `⚠️ Start the bot by entering "start" command here or in a discord server as "${selfbot.config.prefix}start".`
      );
    }
    selfbot.logger.info(
      `ℹ️ You can pause the bot any time using "${selfbot.config.prefix}pause" and resume using "${selfbot.config.prefix}resume". You can also use these commands in here (in the command line), without including the prefix.\nThe bot will automatically pause whenever there is a captcha, so stay tuned in for notifications regarding captcha and solve them accordingly in order to not get banned.`
    );
    selfbot.updateRPC();
  },
});
