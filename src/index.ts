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
        `Issues detected in command ${dir}: ${fromZodError(parsed.error)}`
      );
      return;
    }
    client.commands.set(parsed.data.name, parsed.data);
    client.logger.info(`Registered command ${parsed.data.name} (${dir})`);
  },
});

new Handler({
  selfbot: client,
  rootDir: "events",
  run: (cmd, dir) => {
    const parsed = EventParser.safeParse(cmd);
    if (!parsed.success) {
      client.logger.error(
        `Issues detected in event: ${fromZodError(parsed.error)}`
      );
      return;
    }
    client.on(parsed.data.name, (...args) => parsed.data.run(client, ...args));
    client.logger.info(`Registered event ${parsed.data.name} (${dir})`);
  },
});
client.start();
const rl = readline.createInterface({ input, output });
rl.on("line", (input) => {
  if (input.startsWith("pause")) {
    console.log(client.setPaused(true));
  }
  if (input.startsWith("resume")) {
    console.log(client.setPaused(false));
  }
  if (input.startsWith("toggle")) {
    console.log(client.setPaused());
  }
  if (input.startsWith("start")) {
    if (client.status.started) return console.log(false);
    farm(client);
    console.log((client.status.started = true));
  }
});
