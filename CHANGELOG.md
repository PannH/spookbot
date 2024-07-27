## 1.1.0 (27/07/2024)
### Features
- "/silent" command to toggle silent mode (no info message during rounds).
- "/motbonus" command to show the current bonus word.
- "/broadcast" command to send a message in all rooms where the bot is.
- The used words are now displayed in a different font in the /searchwords response.
- The bonus word messages are more displayed in a more visible way with the warning variant.
- "/version" command to display the current version of the bot and advertize the Discord server.
- Make the bot recreate a new default room after the 9am server reboot.
- The privacy of the default room is now handled with the ENV environment variable being either "dev" or "prod".
- "/reboot" command to reinitiate the default room.
- Hide the role-specific commands in the "/help" message to users without the required role.
- Reinstantiate the bot when a disconnect occurs, but ignore if the disconnect was manual (the active room was deleted).
- Add meta fields to commands to have more clarity in commands usage for the /help command.