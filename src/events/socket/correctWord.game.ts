import { Event } from '../../classes';
import constants from '../../constants';
import {
   formatStatValue,
   getSyllables,
   percentage,
   pluralize
} from '../../functions';
import globals from '../../globals';
import type { AlphabetLetter } from '../../types';

export default new Event(
   {
      name: 'correctWord'
   },
   async (
      client,
      data: {
         playerPeerId: number;
         bonusLetters: Record<AlphabetLetter, number>;
      }
   ) => {
      const { currentWord } = client.room.round;

      if (data.playerPeerId !== client.room.selfPeerId) {
         client.emit('checkWordKnown', currentWord, data.playerPeerId);

         client.room.round.playersStats[data.playerPeerId].words++;

         const chatter = await client.room.getChatter(data.playerPeerId);

         if (!client.room.round.setCategoryWords.includes(currentWord)) {
            const wordCategories =
               await globals.dictionary.getWordCategories(currentWord);

            if (wordCategories?.length) {
               client.room.round.setCategoryWords.push(currentWord);

               for (const category of wordCategories)
                  client.room.round.playersStats[data.playerPeerId][
                     constants.CATEGORY_STATS[category]
                  ]++;

               if (!client.room.trainCategory) {
                  const wordCategoriesString = wordCategories
                     .map(
                        (category) =>
                           `${constants.WORD_CATEGORY_NAMES_WITH_ARTICLE[category]} (${client.room.round.playersStats[data.playerPeerId][constants.CATEGORY_STATS[category]]})`
                     )
                     .join(', ');

                  client.room.sendMessage(
                     `${chatter.nickname} a placé ${wordCategoriesString}: ${currentWord.toUpperCase()}`
                  );
               }
            }

            const wordSyllables = getSyllables(currentWord).filter(
               (syllable) =>
                  !client.room.round.fuckedSyllables.includes(syllable)
            );
            const fuckedSyllables: string[] = (
               await Promise.all(
                  wordSyllables.map(async (syllable) => {
                     const wordsCount = await globals.prisma.word.count({
                        where: {
                           value: {
                              contains: syllable,
                              notIn: client.room.round.setWords
                           }
                        }
                     });

                     return wordsCount === 1 ? syllable : null;
                  })
               )
            ).filter((syllable) => !!syllable);

            if (fuckedSyllables.length) {
               client.room.round.fuckedSyllables.push(...fuckedSyllables);
               client.room.round.playersStats[
                  data.playerPeerId
               ].fuckedSyllables += fuckedSyllables.length;

               !client.room.trainCategory &&
                  client.room.sendMessage(
                     `${chatter.nickname} a niqué ${pluralize(fuckedSyllables.length, 'la syllabe', 'les syllabes')} ${fuckedSyllables.map((syllable) => syllable.toUpperCase()).join(', ')} (${client.room.round.playersStats[data.playerPeerId].fuckedSyllables}): ${currentWord.toUpperCase()}`
                  );
            }

            if (client.room.trainCategory) {
               if (!wordCategories.includes(client.room.trainCategory)) {
                  client.emit('trainHints');
               } else {
                  const categoryStatKey =
                     constants.CATEGORY_STATS[client.room.trainCategory];
                  const stats =
                     client.room.round.playersStats[data.playerPeerId];
                  const stat = stats[categoryStatKey] + 1;
                  const { words } = stats;
                  client.room.sendMessage(
                     `✅ ${chatter.nickname} a placé ${constants.WORD_CATEGORY_NAMES_WITH_ARTICLE[client.room.trainCategory]} (${stat} - ${percentage(stat, words).toFixed(1)}%): ${currentWord.toUpperCase()}`
                  );
               }
            }
         }

         const currentAlphaLetterIndex =
            client.room.round.playersStats[data.playerPeerId].alpha % 26;
         const wordFirstLetterIndex = constants.ALPHA_LETTERS.indexOf(
            currentWord[0] as AlphabetLetter
         );

         if (currentAlphaLetterIndex === wordFirstLetterIndex) {
            client.room.round.playersStats[data.playerPeerId].alpha++;

            !client.room.trainCategory &&
               client.room.sendMessage(
                  `${chatter.nickname} a placé un alpha (${formatStatValue('alpha', client.room.round.playersStats[data.playerPeerId].alpha)}): ${currentWord.toUpperCase()}`
               );
         }
      }

      client.room.round.setWords.push(currentWord);
      client.room.round.currentWord = '';
   }
);
