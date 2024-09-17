import SelfbotEvent from "../structures/event.js";
import notifier from "node-notifier";
import open from "open";
import waitRandomDelay from "../functions/wait.js";
import checkInventory from "../farm/checkInventory.js";
import numberRange from "parse-numeric-range";
import farmHunt from "../farm/hunt.js";
import sendRandomPhrase from "../farm/sendRandomPhrase.js";
import TypedEventEmitter from "../structures/typed-emitter.js";
import { listFormat } from "../functions/listFormat.js";
type EventTypes = {
  inventory: [];
  checklist: [];
  hunt: [];
  randomPhrase: [];
  battle: [];
};
export const emitter = new TypedEventEmitter<EventTypes>();
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
      if (!values) {
        emitter.emit("inventory");
        return selfbot.logger.info(
          "✅ [Inventory] Done checking, no items found."
        );
      }
      const used: string[] = [];
      if (
        values.includes("050") &&
        selfbot.config.settings.inventory.autoUse.lootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("lb all");
        used.push("lootboxes");
      }
      if (
        values.includes("049") &&
        selfbot.config.settings.inventory.autoUse.fabledLootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("lootbox fabled all");
        used.push("fabled lootboxes");
      }
      if (
        values.includes("100") &&
        selfbot.config.settings.inventory.autoUse.lootbox
      ) {
        await waitRandomDelay(4000);
        await selfbot.owoCommand("wc all");
        used.push("weapon crates");
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
          `✅ [Auto Gems] Using gems ${selfbot.status.gems.toUse.join(", ")}`
        );
        await selfbot.owoCommand(`use ${selfbot.status.gems.toUse.join(" ")}`);
        used.push("gems");
        selfbot.status.gems.needed = [];
        selfbot.status.gems.toUse = [];
      }
      selfbot.status.doingCommand = false;
      selfbot.logger.info(
        `✅ [Inventory] Inventory checking done, auto used: ${listFormat.format(
          used.length ? used : ["none"]
        )}`
      );
      emitter.emit("inventory");
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
      selfbot.logger.info("✅ [Checklist] Daily done");
      if (
        embed.description?.includes("⬛ 📝") &&
        selfbot.config.settings.checklist.enabled.vote
      )
        await open("https://top.gg/bot/408785106942164992/vote");
      else {
        selfbot.logger.info("✅ [Checklist] Vote done");
      }
      if (
        embed.description?.includes("⬛ 🍪") &&
        selfbot.config.settings.checklist.enabled.cookie
      ) {
        await waitRandomDelay(3000);
        await selfbot.owoCommand("cookie <@408785106942164992>");
      }
      selfbot.logger.info("✅ [Checklist] Cookie done");
      emitter.emit("checklist");
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
          `⚠️ [Hunt] Missing gems: ${selfbot.status.gems.needed.join(", ")}`
        );
      }
      await waitRandomDelay(1000);
      selfbot.logger.info("✅ [Hunt] Done hunting");
      await sendRandomPhrase(selfbot);
      await waitRandomDelay(10_000);
      selfbot.status.doingCommand = false;
      checkInventory(selfbot);
      emitter.emit("hunt");
    };
    const battle = async () => {
      if (
        message.content.includes(
          "Create a team with the command `owo team add {animal}`"
        )
      ) {
        return selfbot.logger.info(
          "⚠️ [Battle] Couldn't battle: Create a team to battle"
        );
      }
      if (
        !message.embeds[0] ||
        !message.embeds[0].author?.name.includes("goes into battle!")
      )
        return;
      return selfbot.logger.info("✅ [Battle] Successfully started battle.");
    };
    checklist();
    inventory();
    hunt();
    battle();
  },
});
export async function awaitEvent(type: keyof EventTypes) {
  return new Promise<void>((resolve) => {
    emitter.once(type, () => {
      resolve();
    });
  });
}
