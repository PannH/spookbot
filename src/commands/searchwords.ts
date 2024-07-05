import { Command } from '../classes';
import constants from '../constants';
import {
   compactNumber,
   pluralize,
   removeAccents,
   simplifyString
} from '../functions';
import globals from '../globals';
import type { WordCategory } from '../types';

export default new Command(
   {
      name: 'searchwords',
      description: 'Rechercher des mots dans le dictionnaire.',
      aliases: ['sw', 'c'],
      usage: {
         formats: ['/c', '/c <recherche> <param1> <param2> ...'],
         examples: ['/c', '/c ^attrape-', '/c -mc -pl', '/c ites$ -eth']
      }
   },
   async (client, message, args) => {
      const flags = args.filter((arg) => arg.startsWith('-'));
      const queries = args
         .filter((arg) => !flags.includes(arg))
         .map((arg) => removeAccents(arg));

      if (!queries.length && client.room.round)
         queries.push(client.room.round.syllable);

      const flagCategories: Record<string, WordCategory> = {
         '-mc': 'hyphen',
         '-l': 'long',
         '-adv': 'adverb',
         '-pl': 'plant',
         '-eth': 'ethnonym',
         '-cr': 'creature'
      };

      if (flags.some((flag) => flagCategories[flag] === undefined))
         return client.room.sendMessage(
            `Vous avez spécifié un ou plusieurs paramètre(s) invalide(s), veuillez choisir parmi: ${Object.keys(
               flagCategories
            )
               .map(
                  (flag) =>
                     `${flag} (${constants.WORD_CATEGORY_NAMES[flagCategories[flag]]})`
               )
               .join(', ')}`,
            'error'
         );

      const categories = flags.map((flag) => flagCategories[flag]);

      const matchingWords = globals.dictionary.searchWords(queries, {
         categories: categories,
         shuffle: true
      });
      const hiddenWords =
         client.room.round && !client.room.round.hasEnded
            ? matchingWords.filter((word) =>
                 word.includes(client.room.round.syllable)
              )
            : [];

      if (!matchingWords.length && !hiddenWords.length)
         return client.room.sendMessage('Aucun mot trouvé.', 'error');

      const MAX_LENGTH = 200;
      let messageContent = `${compactNumber(matchingWords.length)} ${pluralize(matchingWords.length, 'mot trouvé', 'mots trouvés')}${hiddenWords.length ? ` (${compactNumber(hiddenWords.length)} ${pluralize(hiddenWords.length, 'caché')})` : ''}: `;

      if (matchingWords.length === hiddenWords.length) {
         messageContent += 'Tous les mots sont cachés.';
      } else {
         while (true) {
            const oldMessageContent = messageContent;
            messageContent += `${messageContent.endsWith(': ') ? '' : ', '}${matchingWords.shift().toUpperCase()}`;

            if (!matchingWords.length) break;

            if (messageContent.length > MAX_LENGTH) {
               messageContent = oldMessageContent;
               break;
            }
         }
      }

      client.room.sendMessage(messageContent);
   }
);
