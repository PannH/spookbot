import { Command } from '../classes';
import { getSyllables } from '../functions';

export default new Command(
   {
      name: 'syllables',
      description: "Voir toutes les syllabes d'un mot.",
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

      client.room.sendMessage(
         `Syllabes de ${word.toUpperCase()}: ${syllables.map((syllable) => syllable.toUpperCase()).join(', ')}`
      );
   }
);
