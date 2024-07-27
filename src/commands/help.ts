import { Command } from '../classes';
import { pluralize } from '../functions';
import { commands } from '../globals';
import { getProfileByAuthId } from '../services/db';

export default new Command(
   {
      name: 'help',
      description:
         "Obtenir la liste des commandes ou de l'aide pour l'une d'elles.",
      usageFormats: ['/help', '/help [commande]'],
      usageExamples: ['/help', '/help records']
   },
   async (client, message) => {
      const commandNameQuery = message.args[0]?.toLowerCase();

      if (!commandNameQuery) {
         const profile = await getProfileByAuthId(
            message.chatter.profile.auth?.id
         );

         let shownCommands = commands;

         if (!profile || !profile?.roles?.includes('admin'))
            shownCommands = shownCommands.filter((c) => !c.options.adminOnly);

         if (!profile || !profile?.roles?.includes('dictionaryManager'))
            shownCommands = shownCommands.filter(
               (c) => !c.options.dictionaryManagerOnly
            );

         if (!profile || !profile?.roles?.includes('trusted'))
            shownCommands = shownCommands.filter((c) => !c.options.trustedOnly);

         client.room.sendMessage(
            `Commandes: ${shownCommands.map((c) => `/${c.options.name}`).join(' — ')}`
         );
      } else {
         const command = commands.find(
            (c) =>
               c.options.name === commandNameQuery ||
               c.options.aliases?.includes(commandNameQuery)
         );

         if (!command)
            return client.room.sendMessage(
               `La commande /${commandNameQuery} n'existe pas.`,
               'danger'
            );

         const { options } = command;

         client.room.sendMessage(
            `Commande /${options.name}${options.aliases?.length ? ` (${options.aliases.map((a) => `/${a}`).join(', ')})` : ''}: ${options.description}\n\n${pluralize(options.usageFormats.length, 'Format')} :\n${options.usageFormats.join('\n')}${options.usageExamples?.length ? `\n\n${pluralize(options.usageExamples.length, 'Exemple')} :\n${options.usageExamples.join('\n')}` : ''}${options.metaFields?.length ? `\n\n${options.metaFields.map((mf) => `${mf.title} :\n${mf.content}`).join('\n\n')}` : ''}`
         );
      }
   }
);
