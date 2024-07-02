import { Command } from '../classes';
import { compactNumber } from '../functions';
import globals from '../globals';
import type { WordCategory } from '../types';

export default new Command(
   {
      name: 'searchwords',
      description: 'Rechercher des mots dans le dictionnaire.',
      aliases: ['sw', 'c']
   },
   async (client, message, args) => {
      const flags = args.filter((arg) => arg.startsWith('-'));
      const queries = args
         .filter((arg) => !flags.includes(arg))
         .map((query) => new RegExp(query, 'i'));

      const flagCategories: Record<string, WordCategory> = {
         '-mc': 'hyphen',
         '-l': 'long',
         '-adv': 'adverb',
         '-pl': 'plant',
         '-e': 'ethnonym',
         '-cr': 'creature'
      };
      const categories = flags.map((flag) => flagCategories[flag]);

      const matchingWords = globals.dictionary.searchWords(queries, {
         categories,
         shuffle: true
      });

      if (!matchingWords.length)
         return client.room.sendMessage('Aucun mot trouvé.', 'error');

      const MAX_LENGTH = 300;
      let messageContent = `${compactNumber(matchingWords.length)} ${matchingWords.length > 1 ? 'mots trouvés' : 'mot trouvé'}: `;
      while (true) {
         const oldMessageContent = messageContent;
         messageContent += `${messageContent.endsWith(': ') ? '' : ', '}${matchingWords.shift().toUpperCase()}`;

         if (!matchingWords.length) break;

         if (messageContent.length > MAX_LENGTH) {
            messageContent = oldMessageContent;
            break;
         }
      }

      client.room.sendMessage(messageContent);
   }
);
