# Selfbot Base (Typescript)

This is a template you can use to start building new selfbots easier with [discord.js-selfbot-v13](https://npm.im/discord.js-selfbot-v13) in Node.js with TypeScript.

## Features

- Nice logging
- File-related handlers done easy
- Create commands and events easily
- Extremely typesafe
- Runtime type checking with zod

## Setup

- Copy paste the `.env.example` file and name the new copy `.env`.
- Configure the `.env` file with your account token.
- Add the channel ID where you want the bot to function in `src/config.ts` file (you can also change the other values if needed).
- For first time, you should start the bot by starting the `setup.bat` file if on Windows. For other OSes, you'll have to manually install Node.js and Yarn and then run `yarn start` command.
- If it's not your first time then you can directly run the bot with the command `yarn start`.

## Environment Variables

To run this project, you will need to add the following environment variable(s) to your .env file

`ACCOUNT_TOKEN` - The token to your Discord account

## Configuration

You can configure the selfbot's aspects in src/config.ts

## License

This project is licensed by the [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0//) license. Read the full license page [here](https://raw.githubusercontent.com/mallusrgreatv2/ts-selfbot-base/main/LICENSE).
