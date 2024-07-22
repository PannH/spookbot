import { Command } from '../classes';
import { CATEGORY_NAME } from '../constants';
import { pluralize } from '../functions';
import { dictionary } from '../globals';
import deburr from 'lodash/deburr';

export default new Command(
   {
      name: 'categories',
      aliases: ['cat'],
      description: "Voir les catégories d'un mot.",
      usageFormats: ['/cat [mot]'],
      usageExamples: ['/cat chauve-souris']
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

      const categories = dictionary.getWordCategories(word);

      if (!categories.length)
         return client.room.sendMessage(
            `Le mot ${word.toUpperCase()} n'a aucune catégorie.`
         );

      client.room.sendMessage(
         `${pluralize(categories.length, 'Catégorie')} de ${word.toUpperCase()}: ${categories.map((cat) => CATEGORY_NAME[cat]).join(', ')}.`
      );
   }
);
