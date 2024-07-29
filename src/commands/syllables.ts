import { Command } from '../classes';
import { getSyllables } from '../functions';
import { dictionary } from '../globals';
import deburr from 'lodash/deburr';

export default new Command(
   {
      name: 'syllables',
      aliases: ['syl'],
      description: "Voir les syllabes et leur rareté d'un mot",
      usageFormats: ['/syl [mot]'],
      usageExamples: ['/syl wahhabisme']
   },
   async (client, message) => {
      const word = deburr(message.args[0]?.toLowerCase());

      if (!word)
         return client.room.sendMessage('Veuillez spécifier un mot.', 'danger');

      if (!dictionary.hasWord(word))
         return client.room.sendMessage(
            `Le mot ${word.toUpperCase()} est inconnu.`,
            'danger'
         );

      const syllables = getSyllables(word);
      const syllableRarities = (
         await Promise.all(
            syllables.map(async (syl) => ({
               syllable: syl,
               wordsCount: (
                  await dictionary.searchWords(syl, { excludeUntesteds: true })
               ).length
            }))
         )
      ).sort((a, b) => a.wordsCount - b.wordsCount);

      client.room.sendMessage(
         `Syllabes de ${word.toUpperCase()} (${syllables.length}): ${syllableRarities.map(({ syllable, wordsCount }) => `${syllable.toUpperCase()} (${wordsCount})`).join(', ')}.`
      );
   }
);
