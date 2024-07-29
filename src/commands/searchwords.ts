import { Command } from '../classes';
import deburr from 'lodash/deburr';
import shuffle from 'lodash/shuffle';
import isSafeRegex from 'safe-regex';
import { CATEGORY_NAME } from '../constants';
import { dictionary } from '../globals';
import type { WordCategory } from '../types';
import { compactNumber, pluralize, boldify } from '../functions';

export default new Command(
   {
      name: 'searchwords',
      aliases: ['sw', 'c'],
      description: 'Rechercher des mots dans le dictionnaire.',
      usageFormats: [
         '/c [recherche] [-catégorie1] [-catégorie2] [...] [-test]'
      ],
      usageExamples: [
         '/c biolog',
         '/c ^auto-.+',
         '/c -l -adv',
         '/c souris -mc -pl'
      ],
      metaFields: [
         {
            title: 'Guide expr. rég.',
            content: 'https://shorturl.at/190LW'
         }
      ]
   },
   async (client, message) => {
      const queries = message.args.map((arg) => deburr(arg));

      const untestedsOnly = message.flags.includes('-test');

      if (untestedsOnly)
         message.flags = message.flags.filter((f) => f !== '-test');

      if (queries.some((query) => !isSafeRegex(query)))
         return client.room.sendMessage(
            'Veuillez ne spécifier que des expressions régulières sûres ou moins complexes.',
            'danger'
         );

      if (!queries.length) {
         if (client.room.round && !client.room.round.isOver)
            queries.push(client.room.round.currentSyllable);
         else if (!client.room.round || client.room.round?.isOver)
            queries.push('.');
      }

      const FLAG_TO_CATEGORY: Record<string, WordCategory> = {
         '-mc': 'hyphen',
         '-l': 'long',
         '-adv': 'adverb',
         '-pl': 'plant',
         '-eth': 'ethnonym',
         '-cr': 'creature'
      };

      const categories = message.flags.length
         ? message.flags.map((flag) => FLAG_TO_CATEGORY[flag])
         : [];

      if (categories.some((category) => !category))
         return client.room.sendMessage(
            `Veuillez spécifier des paramètres valides parmi: ${Object.entries(
               FLAG_TO_CATEGORY
            )
               .map(
                  ([flag, category]) => `${flag} (${CATEGORY_NAME[category]})`
               )
               .join(', ')}.`,
            'danger'
         );

      const matchingWords = await dictionary.searchWords(queries, {
         withCategories: categories,
         untestedsOnly: untestedsOnly,
         excludeUntesteds: !untestedsOnly
      });

      if (!matchingWords.length)
         return client.room.sendMessage(
            'Aucun mot ne correspond à votre recherche.',
            'danger'
         );

      const hiddenWords = new Set(
         client.room.round &&
            !client.room.round.isOver &&
            client.room.registerStats
            ? matchingWords.filter((word) =>
                 word.includes(client.room.round.currentSyllable)
              )
            : []
      );
      const shownWords = shuffle(
         matchingWords.filter((word) => !hiddenWords.has(word))
      );

      let messageContent = `${compactNumber(matchingWords.length)} ${pluralize(matchingWords.length, 'mot trouvé', 'mots trouvés')}${hiddenWords.size ? ` (${compactNumber(hiddenWords.size)} ${pluralize(hiddenWords.size, 'caché')})` : ''}${untestedsOnly ? ' [test]' : ''}: `;

      const MAX_CONTENT_LENGTH = 200;
      if (!shownWords.length) {
         messageContent += 'Tous les mots sont cachés.';
      } else {
         while (true) {
            const oldMessageContent = messageContent;
            const word = shownWords.shift();
            messageContent += `${messageContent.endsWith(': ') ? '' : ', '}${client.room.round && !client.room.round.isOver && client.room.round.usedWords.has(word) ? boldify(word.toUpperCase()) : word.toUpperCase()}`;

            if (!shownWords.length) break;

            if (messageContent.length > MAX_CONTENT_LENGTH) {
               messageContent = oldMessageContent;
               break;
            }
         }
      }

      client.room.sendMessage(messageContent);
   }
);
