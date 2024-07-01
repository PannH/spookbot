import { Event } from '../../classes';
import globals from '../../globals';

export default new Event(
   {
      name: 'selfTurn'
   },
   (client) => {
      const matchingWords = globals.dictionary.searchWords(
         client.room.round.syllable,
         {
            excludes: client.room.round.setWords,
            shuffle: true
         }
      );

      client.room.round.setWord(matchingWords[0]);
   }
);
