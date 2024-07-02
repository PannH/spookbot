import { Command } from '../classes';
import { simplifyString } from '../functions';
import globals from '../globals';

export default new Command(
   {
      name: 'dictionary',
      description: 'Gérer le dictionnaire.',
      aliases: ['dict'],
      requiredStaffRoles: ['DICTIONARY_MANAGER', 'TRUSTED']
   },
   async (client, message, args) => {
      const subcommand = args.shift();

      switch (subcommand) {
         case 'add': {
            const words = args.map((word) => simplifyString(word));
            const knownWords = words.filter((word) =>
               globals.dictionary.isWordKnown(word)
            );
            const unknownWords = words.filter(
               (word) => !knownWords.includes(word)
            );

            if (!unknownWords.length)
               return client.room.sendMessage(
                  'Tous les mots indiqués sont déjà dans le dictionnaire.',
                  'error'
               );

            for (const word of unknownWords)
               await globals.dictionary.addWord(word);

            client.room.sendMessage(
               `[+] ${unknownWords.map((word) => word.toUpperCase()).join(', ')}`,
               'success'
            );

            break;
         }

         case 'remove': {
            const words = args.map((word) => simplifyString(word));
            const knownWords = words.filter((word) =>
               globals.dictionary.isWordKnown(word)
            );

            if (!knownWords.length)
               return client.room.sendMessage(
                  "Aucun des mots indiqués n'est dans le dictionnaire.",
                  'error'
               );

            for (const word of knownWords)
               await globals.dictionary.removeWord(word);

            client.room.sendMessage(
               `[-] ${knownWords.map((word) => word.toUpperCase()).join(', ')}`,
               'success'
            );

            break;
         }

         default:
            client.room.sendMessage(
               'Vous devez indiquez une de ces sous-commandes: "add", "remove"',
               'error'
            );
            break;
      }
   }
);
