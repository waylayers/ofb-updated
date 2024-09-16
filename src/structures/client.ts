import {
  Client,
  Collection,
  RichPresence,
  TextBasedChannel,
} from "discord.js-selfbot-v13";
import { fromZodError } from "zod-validation-error";
import { CommandParser, EnvTokenParser } from "../parsers.js";
import Logger from "./logger.js";
import { z } from "zod";
import botConfig from "../config/config.js";
export default class Selfbot extends Client {
  logger = new Logger();
  config = botConfig;
  commands = new Collection<string, z.infer<typeof CommandParser>>();
  paused = false;
  setPaused(paused?: boolean) {
    this.updateRPC();
    this.paused = paused || !this.paused;
    return this.paused;
  }
  status = {
    name: "owofarmbot_stable",
    started: false,
    doingCommand: false,
    gems: {
      needed: [] as string[],
      toUse: [] as string[],
    },
  };
  constructor() {
    super({
      allowedMentions: {
        repliedUser: true,
        roles: [],
        users: [],
      },
    });
  }
  get mainChannel() {
    return this.channels.cache.get(
      this.config.mainChannelId
    ) as TextBasedChannel;
  }
  start() {
    const token = process.env.ACCOUNT_TOKEN;
    const parsed = EnvTokenParser.safeParse(token);
    if (!parsed.success) {
      this.logger.error(
        `Issues detected in token: ${fromZodError(parsed.error)}`
      );
      process.exit();
    }
    this.login(token);
  }
  updateRPC() {
    if (!botConfig.settings.rpc) return;
    const status = new RichPresence(this)
      .setApplicationId("1253757665520259173")
      .setType("PLAYING")
      .setName("OwO Farm Bot Stable")
      .setDetails("Auto Farming")
      .setState(`${this.paused ? "Paused" : "Running"}`)
      .setStartTimestamp(new Date())
      .setAssetsLargeImage("1253758464816054282")
      .setAssetsLargeText("OwO Farm Bot Stable")
      .addButton("Farm Bot", "https://github.com/Mid0aria/owofarmbot_stable")
      .addButton("Discord", "https://discord.gg/WzYXVbXt6C");
    this.user?.setPresence({ activities: [status] });
  }
  owoCommand(command: string) {
    return this.mainChannel?.send(
      `${this.config.settings.owoPrefix} ${command}`
    );
  }
  get safeToUseCommand() {
    return !this.paused && !this.status.doingCommand;
  }
}
