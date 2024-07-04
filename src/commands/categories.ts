import { Command } from '../classes';
import constants from '../constants';
import { pluralize, simplifyString } from '../functions';
import globals from '../globals';

export default new Command(
   {
      name: 'categories',
      description: "Voir les catégories d'un mot",
      aliases: ['cat'],
      usage: {
         formats: ['/cat <mot>'],
         examples: ['/cat chauve-souris']
      }
   },
   async (client, message, args) => {
      const word = args[0] ? simplifyString(args[0]) : null;

      if (!word)
         return client.room.sendMessage('Veuillez indiquer un mot.', 'error');

      const categories = globals.dictionary.getWordCategories(word);

      if (!categories)
         return client.room.sendMessage(
            "Ce mot n'est pas dans le dictionnaire.",
            'error'
         );

      if (!categories.length)
         return client.room.sendMessage("Ce mot n'a aucune catégorie.");

      const categoriesString = categories
         .map((category) => constants.WORD_CATEGORY_NAMES[category])
         .join(', ');

      client.room.sendMessage(
         `${pluralize(categories.length, 'Catégorie')} de ${word.toUpperCase()}: ${categoriesString}`
      );
   }
);
