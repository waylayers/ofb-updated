@echo off
echo Installing node...
winget install --id OpenJS.NodeJS.LTS
echo Installing yarn...
winget install --id Yarn.Yarn
echo Installing packages...
yarn
echo Starting bot...
yarn start