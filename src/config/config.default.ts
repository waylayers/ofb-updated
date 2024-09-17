export default {
  /** the prefix of the selfbot, i.e if your prefix is ">" then you can use >pause and >resume */
  prefix: ">",
  /** the channel id the owo commands will be used in */
  mainChannelId: "",
  /** whether the selfbot should use these commands periodically or not */
  commands: {
    hunt: true,
    battle: true,
    pray: true,
    curse: true,
  },
  settings: {
    /** the prefix of the owo bot in your server */
    owoPrefix: "owo",
    /** automatically start the selfbot without having to use the start command */
    autoStart: true,
    /** whether to show rpc in your account */
    rpc: false,
    /** automatically send random phrases to not get flagged as a bot */
    autoPhrases: true,
    checklist: {
      /** whether to automatically check for undone things */
      check: true,
      /** whether to automatically do these if they appear in the checklist */
      enabled: {
        daily: true,
        cookie: true,
        vote: true,
      },
    },
    inventory: {
      check: true,
      autoUse: {
        lootbox: true,
        fabledLootbox: true,
        crates: true,
        gems: true,
      },
    },
    captcha: {
      /** recommended to set to true to not get banned */
      autoPause: true,
      /** whether to send a notification to your system when there is a captcha */
      notification: true,
      /** whether to open the link to do captcha if applicable */
      autoOpen: true,
    },
  },
  animals: {
    enabled: false,
    type: {
      sell: false,
      sacrifice: false,
    },
    animalTypes: {
      common: false,
      uncommon: false,
      rare: false,
      epic: false,
      mythical: false,
      patreon: false,
      cpatreon: false,
      legendary: false,
      gem: false,
      bot: false,
      distorted: false,
      fabled: false,
      special: false,
      hidden: false,
    },
  },
};
