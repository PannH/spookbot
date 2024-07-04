import { Client, Command } from '../classes';
import { pluralize } from '../functions';

export default new Command(
   {
      name: 'help',
      description:
         "Voir les commandes disponibles ou de l'aide à propos d'une commande spécifique.",
      aliases: ['h'],
      usage: {
         formats: ['/help', '/help <commande>'],
         examples: ['/help', '/help searchwords']
      },
      requireAuth: true
   },
   async (client, message, args) => {
      const commandName = args[0]?.toLowerCase();
      const commands = [...client.commands.values()];

      if (!commandName) {
         const commandsString = commands
            .map((command) => `/${command.options.name}`)
            .join(' — ');

         client.room.sendMessage(`Commandes: ${commandsString}`);
      } else {
         const command =
            client.commands.get(commandName) ||
            commands.find((command) =>
               command.options.aliases?.includes(commandName)
            );

         if (!command)
            return client.room.sendMessage(
               `Aucune commande ne correspond à /${commandName}`,
               'error'
            );

         const { options } = command;

         client.room.sendMessage(
            `Commande /${options.name}${options.aliases?.length ? ` (${options.aliases?.map((alias) => `/${alias}`)?.join(', ')})` : ''}: ${options.description}\n\n${pluralize(options.usage.formats.length, 'Utilisation')}:\n${options.usage.formats.map((format) => `- ${format}`).join('\n')}${options.usage.examples?.length ? `\n\n${pluralize(options.usage.examples.length, 'Exemple')}:\n${options.usage.examples.map((example) => `- ${example}`).join('\n')}` : ''}`
         );
      }
   }
);
