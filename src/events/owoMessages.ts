import EventEmitter from "events";
import SelfbotEvent from "../structures/event.js";
import notifier from "node-notifier";
import open from "open";
import waitRandomDelay from "../functions/wait.js";
import checkInventory from "../farm/checkInventory.js";
import numberRange from "parse-numeric-range";
import farmHunt from "../farm/hunt.js";
import sendRandomPhrase from "../farm/sendRandomPhrase.js";
export const emitter = new EventEmitter();
export default new SelfbotEvent({
  name: "messageCreate",
  async run(selfbot, message) {
    if (message.author.id !== "408785106942164992") return;
    const captchaMessages = [
      "please complete your captcha",
      "verify that you are human",
      "are you a real human",
      "please use the link below so I can check",
    ];
    if (captchaMessages.some((m) => message.content.includes(m))) {
      if (selfbot.config.settings.captcha.autoPause) selfbot.setPaused(true);
      if (selfbot.config.settings.captcha.notification)
        notifier.notify({
          title: "Captcha Detected",
          message: `The bot has been paused. Go back and solve the captcha and resume (${selfbot.config.prefix}resume)`,
          appID: "OwOFarmBot",
          icon: "assets/owobot.webp",
        });
      if (
        selfbot.config.settings.captcha.autoOpen &&
        message.content.includes("owobot.com/captcha")
      )
        open("https://owobot.com/captcha");
    }
    const inventory = async () => {
      if (!message.content.includes("Inventory ======")) return;
      selfbot.status.doingCommand = true;
      const values = message.content
        .match(/`([0-9]+)`/g)
        ?.map((v) => v.replaceAll("`", ""));
      if (!values) return;
      if (
        values.includes("050") &&
        selfbot.config.settings.inventory.autoUse.lootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("lb all");
      }
      if (
        values.includes("049") &&
        selfbot.config.settings.inventory.autoUse.fabledLootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("lootbox fabled all");
      }
      if (
        values.includes("100") &&
        selfbot.config.settings.inventory.autoUse.lootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("wc all");
      }
      if (!selfbot.config.settings.inventory.autoUse.gems) return;
      const { needed: neededGems } = selfbot.status.gems;
      const includeNumberRange = (range: string) => {
        numberRange(range).forEach(
          (v) =>
            values.includes(`0${v}`) &&
            selfbot.status.gems.toUse.push(v.toString())
        );
      };
      if (neededGems.includes("gem1")) includeNumberRange("51-57");
      if (neededGems.includes("gem3")) includeNumberRange("65-71");
      if (neededGems.includes("gem4")) includeNumberRange("72-78");
      if (neededGems.includes("star")) includeNumberRange("79-85");
      await waitRandomDelay(4000);
      if (selfbot.status.gems.toUse.length) {
        selfbot.logger.info(
          `[Auto Gems] Using gems ${selfbot.status.gems.toUse.join(", ")}`
        );
        await selfbot.owoCommand(`use ${selfbot.status.gems.toUse.join(" ")}`);
        selfbot.status.gems.needed = [];
        selfbot.status.gems.toUse = [];
      }
      selfbot.status.doingCommand = false;
      selfbot.logger.info("[Inventory] Inventory checking done");
    };
    const checklist = async () => {
      const embed = message.embeds[0];
      if (!embed?.author?.name?.includes("Checklist")) return;
      selfbot.status.doingCommand = true;
      if (
        embed.description?.includes("⬛ 🎁") &&
        selfbot.config.settings.checklist.enabled.daily
      ) {
        await waitRandomDelay(3000);
        await selfbot.owoCommand("daily");
      }
      selfbot.logger.info("[Checklist] Daily done");
      if (
        embed.description?.includes("⬛ 📝") &&
        selfbot.config.settings.checklist.enabled.vote
      )
        await open("https://top.gg/bot/408785106942164992/vote");
      else {
        selfbot.logger.info("[Checklist] Vote done");
      }
      if (
        embed.description?.includes("⬛ 🍪") &&
        selfbot.config.settings.checklist.enabled.cookie
      ) {
        await waitRandomDelay(3000);
        await selfbot.owoCommand("cookie <@408785106942164992>");
      }
      selfbot.logger.info("[Checklist] Cookie done");
      selfbot.status.doingCommand = false;
      if (selfbot.config.settings.inventory.check) checkInventory(selfbot);
      else if (selfbot.config.commands.hunt) farmHunt(selfbot);
    };
    const hunt = async () => {
      if (!message.content.startsWith("**🌱 | ")) return;
      selfbot.status.doingCommand = true;
      ["gem1", "gem3", "gem4", "star"].forEach(
        (v) => message.content.includes(v) && selfbot.status.gems.needed.push(v)
      );
      if (selfbot.status.gems.needed.length) {
        selfbot.logger.info(
          `[Hunt] Missing gems: ${selfbot.status.gems.needed.join(", ")}`
        );
      }
      await waitRandomDelay(1000);
      selfbot.logger.info("[Hunt] Done successfully");
      await sendRandomPhrase(selfbot);
      await waitRandomDelay(10_000);
      selfbot.status.doingCommand = false;
      checkInventory(selfbot);
      selfbot.logger.info("[Hunt] Done hunting...");
    };
    checklist();
    inventory();
    hunt();
  },
});
