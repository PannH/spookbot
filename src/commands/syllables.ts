import { Command } from '../classes';
import { compactNumber, getSyllables } from '../functions';
import globals from '../globals';

export default new Command(
   {
      name: 'syllables',
      description: "Voir toutes les syllabes et leur rareté d'un mot.",
      aliases: ['syl'],
      usage: {
         formats: ['/syl <mot>'],
         examples: ['/syl keynesianisme']
      }
   },
   async (client, message, args) => {
      const word = args[0];

      if (!word)
         return client.room.sendMessage('Veuillez indiquer un mot.', 'error');

      const syllables = getSyllables(word);
      const syllablesRarity = syllables.map((syllable) => {
         const matchingWordsCount =
            globals.dictionary.searchWords(syllable).length;

         return {
            syllable,
            wordsCount: matchingWordsCount
         };
      });

      const syllablesString = syllablesRarity
         .sort((a, b) => a.wordsCount - b.wordsCount)
         .map(
            ({ syllable, wordsCount }) =>
               `${syllable.toUpperCase()} (${compactNumber(wordsCount)})`
         )
         .join(', ');

      client.room.sendMessage(
         `Syllabes de ${word.toUpperCase()}: ${syllablesString}`
      );
   }
);
