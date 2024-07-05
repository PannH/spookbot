import { Event } from '../../classes';
import globals from '../../globals';

export default new Event(
   {
      name: 'selfTurn'
   },
   async (client) => {
      const matchingWords = globals.dictionary.searchWords(
         client.room.round.syllable,
         {
            excludes: client.room.round.setWords,
            shuffle: true,
            limit: 1,
            pritoritizeLessCategories: true
         }
      );

      if (!matchingWords.length) {
         client.room.round.setWord('Aucun mot trouvé 😔', false);
         setTimeout(() => {
            client.room.round.setWord('💥');
         }, 1000);
      } else {
         client.room.round.setWord(matchingWords[0]);
      }
   }
);
