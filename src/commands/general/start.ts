import farm from "../../farm/index.js";
import SelfbotCommand from "../../structures/command.js";

export default new SelfbotCommand({
  name: "start",
  description: "Start farming",
  async run({ selfbot, message }) {
    if (selfbot.status.started)
      return message.reply(`Selfbot is already started`);
    farm(selfbot);
    selfbot.status.started = true;
    return message.reply(`Selfbot started`);
  },
});
