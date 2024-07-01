import { Event, type Message } from '../../classes';

export default new Event(
   {
      name: 'chat'
   },
   (client, message: Message) => {
      const COMMAND_PREFIXES = ['.', '!', '/'];

      if (
         COMMAND_PREFIXES.some((PREFIX) => message.content.startsWith(PREFIX))
      ) {
         const args = message.content.split(/ +/gm);
         const commandName = args.shift().slice(1).toLowerCase();
         const command =
            client.commands.get(commandName) ??
            [...client.commands.values()].find((command) =>
               command.options.aliases.includes(commandName)
            );

         if (command) command.callback(client, message, args);
      }
   }
);
