import { Event } from '../../classes';
import { dictionary } from '../../globals';
import {
   TRAIN_CATEGORY_NAME_PLURAL,
   TRAIN_CATEGORY_NAME_SINGULAR,
   TRAIN_CATEGORY_TO_WORD_CATEGORY
} from '../../constants';
import shuffle from 'lodash/shuffle';
import capitalize from 'lodash/capitalize';
import { compactNumber } from '../../functions';

export default new Event('trainHints', async (client, syllable) => {
   client.room.round.isIdle = true;

   const hintWords = await dictionary.searchWords(syllable, {
      excludeSet: client.room.round.usedWords,
      withCategories: [
         TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]
      ]
   });

   if (!hintWords.length) {
      client.room.sendMessage(
         `✖️ Aucun ${TRAIN_CATEGORY_NAME_SINGULAR[client.room.trainCategory]} pour ${client.room.round.previousSyllable.toUpperCase()}.`
      );
   } else {
      const words = shuffle(hintWords)
         .slice(0, 5)
         .map((word) => word.toUpperCase());
      client.room.sendMessage(
         `💡 ${capitalize(TRAIN_CATEGORY_NAME_PLURAL[client.room.trainCategory])} pour ${client.room.round.previousSyllable.toUpperCase()} (${compactNumber(hintWords.length)}): ${words.join(', ')}`
      );
   }
});
