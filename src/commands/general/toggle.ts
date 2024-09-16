import SelfbotCommand from "../../structures/command.js";

export default new SelfbotCommand({
  name: "toggle",
  description: "Toggle farming",
  async run({ selfbot, message }) {
    const paused = selfbot.setPaused();
    return message.reply(`Selfbot is now ${paused ? "paused" : "resumed"}`);
  },
});
