import { Event } from '../../classes';
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
      if (!globals.dictionary.isWordKnown(currentWord)) {
         await globals.dictionary.addWord(currentWord);

         client.room.sendMessage(
            `Le mot ${currentWord.toUpperCase()} était inconnu et a été ajouté au dictionnaire.`,
            'info'
         );
      }

      client.room.round.setWords.push(currentWord);
      client.room.round.currentWord = '';
   }
);
