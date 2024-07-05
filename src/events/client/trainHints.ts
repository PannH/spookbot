import { Event } from '../../classes';
import constants from '../../constants';
import { capitalize } from '../../functions';
import globals from '../../globals';

export default new Event(
   {
      name: 'trainHints'
   },
   async (client) => {
      const { trainCategory, round } = client.room;
      const { previousSyllable, setWords } = round;
      if (trainCategory) {
         const words = globals.dictionary.searchWords(previousSyllable, {
            categories: [trainCategory],
            excludes: setWords,
            limit: 5,
            shuffle: true
         });

         if (words.length) {
            client.room.sendMessage(
               `💡 ${capitalize(constants.WORD_CATEGORY_NAMES_PLURAL[trainCategory])} pour ${previousSyllable.toUpperCase()}: ${words.map((word) => word.toUpperCase()).join(', ')}`
            );
         } else {
            client.room.sendMessage(
               `✖️ Aucun ${constants.WORD_CATEGORY_NAMES[trainCategory]} pour ${previousSyllable.toUpperCase()}.`
            );
         }
      }
   }
);
