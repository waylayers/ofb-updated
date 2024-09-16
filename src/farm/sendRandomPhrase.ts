import Selfbot from "../structures/client.js";
import phrases from "../config/phrases.js";
import waitRandomDelay from "../functions/wait.js";
export default async function sendRandomPhrase(selfbot: Selfbot) {
  if (selfbot.paused) return;
  if (!selfbot.config.settings.autoPhrases) return;
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  if (!phrase) return;
  await waitRandomDelay(2000);
  await selfbot.mainChannel.send(phrase);
  selfbot.logger.info("[Phrases] Sent random phrase");
}
