import "dotenv/config";

import { fromZodError } from "zod-validation-error";
import { CommandParser, EventParser } from "./parsers.js";
import Selfbot from "./structures/client.js";
import Handler from "./structures/handler.js";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import farm from "./farm/index.js";

const client = new Selfbot();

new Handler({
  selfbot: client,
  rootDir: "commands",
  run: (cmd, dir) => {
    const parsed = CommandParser.safeParse(cmd);
    if (!parsed.success) {
      client.logger.error(
        `❌ Issues detected in command ${dir}: ${fromZodError(parsed.error)}`
      );
      return;
    }
    client.commands.set(parsed.data.name, parsed.data);
    client.logger.info(`✅ Registered command ${parsed.data.name} (${dir})`);
  },
});

new Handler({
  selfbot: client,
  rootDir: "events",
  run: (cmd, dir) => {
    const parsed = EventParser.safeParse(cmd);
    if (!parsed.success) {
      client.logger.error(
        `❌ Issues detected in event: ${fromZodError(parsed.error)}`
      );
      return;
    }
    client.on(parsed.data.name, (...args) => parsed.data.run(client, ...args));
    client.logger.info(`✅ Registered event ${parsed.data.name} (${dir})`);
  },
});
client.start();
const rl = readline.createInterface({ input, output });
rl.on("line", (input) => {
  if (input.startsWith("pause")) {
    client.logger.info(`Paused: ${client.setPaused(true) ? "Yes" : "No"}`);
  }
  if (input.startsWith("resume")) {
    client.logger.info(`Paused: ${client.setPaused(false) ? "Yes" : "No"}`);
  }
  if (input.startsWith("toggle")) {
    client.logger.info(`Paused: ${client.setPaused() ? "Yes" : "No"}`);
  }
  if (input.startsWith("start")) {
    if (client.status.started)
      return client.logger.info(`❌ Bot is already started`);
    farm(client);
    client.status.started = true;
    client.logger.info(`✅ Bot is now started!`);
  }
  if (input.startsWith("stats")) {
    const stats = client.getStats(true, true) as string[];
    stats.forEach((x) => client.logger.info(x));
  }
});
