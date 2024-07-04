import { Event } from '../../classes';
import constants from '../../constants';
import { formatStatValue } from '../../functions';
import globals from '../../globals';
import type { PlayerStats } from '../../interfaces';
import type { AlphabetLetter, WordCategory } from '../../types';

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
      if (!globals.dictionary.isWordKnown(currentWord)) {
         await globals.dictionary.addWord(currentWord);

         client.room.sendMessage(
            `Le mot ${currentWord.toUpperCase()} était inconnu et a été ajouté au dictionnaire.`,
            'info'
         );
      }

      if (data.playerPeerId !== client.room.selfPeerId) {
         client.room.round.playersStats[data.playerPeerId].words++;

         const wordCategories =
            globals.dictionary.getWordCategories(currentWord);

         const categoryStats: Record<WordCategory, keyof PlayerStats> = {
            adverb: 'adverbs',
            creature: 'creatures',
            ethnonym: 'ethnonyms',
            hyphen: 'hyphens',
            long: 'longs',
            plant: 'plants'
         };

         const chatter = await client.room.getChatter(data.playerPeerId);

         if (wordCategories.length) {
            for (const category of wordCategories)
               client.room.round.playersStats[data.playerPeerId][
                  categoryStats[category]
               ]++;

            const wordCategoriesString = wordCategories
               .map(
                  (category) =>
                     `${constants.WORD_CATEGORY_NAMES_WITH_ARTICLE[category]} (${client.room.round.playersStats[data.playerPeerId][categoryStats[category]]})`
               )
               .join(', ');

            client.room.sendMessage(
               `${chatter.nickname} a placé ${wordCategoriesString}: ${currentWord.toUpperCase()}`
            );
         }

         const currentAlphaLetterIndex =
            client.room.round.playersStats[data.playerPeerId].alpha % 26;
         const wordFirstLetterIndex = constants.ALPHA_LETTERS.indexOf(
            currentWord[0] as AlphabetLetter
         );

         if (currentAlphaLetterIndex === wordFirstLetterIndex) {
            client.room.round.playersStats[data.playerPeerId].alpha++;

            client.room.sendMessage(
               `${chatter.nickname} a placé un alpha (${formatStatValue('alpha', client.room.round.playersStats[data.playerPeerId].alpha)}): ${currentWord.toUpperCase()}`
            );
         }
      }

      client.room.round.setWords.push(currentWord);
      client.room.round.currentWord = '';
   }
);
