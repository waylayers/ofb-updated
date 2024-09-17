import SelfbotCommand from "../../structures/command.js";

export default new SelfbotCommand({
  name: "stats",
  description: "View bot's statistics",
  async run({ selfbot, message }) {
    const stats = selfbot.getStats(false);
    await message.reply(stats as string);
  },
});
