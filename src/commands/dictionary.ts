import { Command } from '../classes';
import { simplifyString } from '../functions';
import globals from '../globals';

export default new Command(
   {
      name: 'dictionary',
      description: 'Gérer le dictionnaire.',
      aliases: ['dict'],
      usage: {
         formats: [
            '/dict add <mot1> <mot2> ...',
            '/dict remove <mot1> <mot2> ...'
         ],
         examples: [
            '/dict add hippoboscide hippoboscides',
            '/dict remove samsung'
         ]
      },
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

            globals.dictionary.addWords(unknownWords);

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

            globals.dictionary.removeWords(knownWords);

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
