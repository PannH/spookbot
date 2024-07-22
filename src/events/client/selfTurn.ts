import { Event } from '../../classes';
import { dictionary } from '../../globals';
import { pickRandom, sleep } from '../../functions';
import random from 'lodash/random';

export default new Event('selfTurn', async (client) => {
   const matchingWords = await dictionary.searchWords(
      client.room.round.currentSyllable,
      {
         excludeSet: client.room.round.usedWords
      }
   );

   if (!matchingWords.length) return client.room.round.setWord('💥');

   const noCategoryWords = matchingWords.filter(
      (word) => !dictionary.getWordCategories(word).length
   );
   const randomWord = pickRandom(
      noCategoryWords.length ? noCategoryWords : matchingWords
   );

   if (client.room.trainCategory) {
      await sleep(100);

      if (client.room.round.isIdle)
         await new Promise<void>((resolve) => {
            const MAX_PROGRESS = 8;
            let i = 0;
            const progressInterval = setInterval(() => {
               if (i === MAX_PROGRESS) {
                  clearInterval(progressInterval);
                  resolve();
               }

               const progressString =
                  '◻️'.repeat(i) + '⬛'.repeat(MAX_PROGRESS - i);
               client.room.round.setWord(progressString, false);

               i++;
            }, 500);
         });

      client.room.round.setWord(randomWord);
      client.room.round.isIdle = false;
   } else {
      switch (client.room.playstyle) {
         case 'normal': {
            client.room.round.setWord(randomWord);
            break;
         }

         case 'reverse': {
            const RTL_CHARACTER = '‮';

            let currentString = '';
            for (const character of randomWord.split('')) {
               await sleep(25);
               currentString += RTL_CHARACTER + character;
               client.room.round.setWord(
                  currentString,
                  currentString.length === randomWord.length * 2
               );
            }

            break;
         }

         case 'crypted': {
            const MAX_INPUT_LENGTH = 30;
            const digitsCount = MAX_INPUT_LENGTH - randomWord.length;
            const digitsCountBetweenEachLetter = Math.floor(
               digitsCount / randomWord.length
            );

            let cryptedWord = '';
            for (const character of randomWord.split('')) {
               let digitsString = '';
               for (let i = 0; i < digitsCountBetweenEachLetter; i++)
                  digitsString += random(0, 9);

               cryptedWord += digitsString + character;
            }

            for (let i = 0; i < 20; i++) {
               await sleep(25);
               let digitsString = '';
               for (let i = 0; i < cryptedWord.length; i++) {
                  digitsString += random(0, 9);
               }
               client.room.round.setWord(digitsString, false);
            }

            client.room.round.setWord(cryptedWord);

            break;
         }

         case 'human': {
            let inputString = '';
            for (const character of randomWord.split('')) {
               await sleep(random(10, 200));
               inputString += character;
               client.room.round.setWord(inputString, false);
            }

            await sleep(random(10, 100));
            client.room.round.setWord(randomWord);
         }
      }
   }
});
