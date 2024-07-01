import { Event } from '../../classes';
import globals from '../../globals';

export default new Event(
   {
      name: 'failWord'
   },
   async (
      client,
      peerId: number,
      reason: 'mustContainSyllable' | 'notInDictionary'
   ) => {
      if (peerId !== client.room.selfPeerId) return;

      const { currentWord } = client.room.round;
      if (
         reason === 'notInDictionary' &&
         globals.dictionary.isWordKnown(currentWord)
      ) {
         await globals.dictionary.removeWord(currentWord);

         client.room.sendMessage(
            `Le mot ${currentWord.toUpperCase()} n'a pas fonctionné et a été retiré du dictionnaire.`,
            'info'
         );
      }
   }
);
