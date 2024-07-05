import { Command } from '../classes';
import constants from '../constants';
import type { WordCategory } from '../types';

export default new Command(
   {
      name: 'train',
      description: 'Gérer le mode entraînement.',
      usage: {
         formats: ['/train <catégorie>', '/train off'],
         examples: ['/train adv', '/train off']
      },
      roomOwnerOnly: true,
      onlyInSeating: true
   },
   async (client, message, args) => {
      const categoryShortcut = args[0]?.toLowerCase();

      const CATEGORY_SHORTCUTS: Record<string, WordCategory> = {
         adv: 'adverb',
         cr: 'creature',
         eth: 'ethnonym',
         mc: 'hyphen',
         l: 'long',
         pl: 'plant'
      };

      if (
         !categoryShortcut ||
         (!Object.keys(CATEGORY_SHORTCUTS).includes(categoryShortcut) &&
            categoryShortcut !== 'off')
      )
         return client.room.sendMessage(
            `Veuillez spécifier "off" ou une des catégories parmi: ${Object.keys(
               CATEGORY_SHORTCUTS
            )
               .map(
                  (shortcut) =>
                     `${shortcut} (${constants.WORD_CATEGORY_NAMES_PLURAL[CATEGORY_SHORTCUTS[shortcut]]})`
               )
               .join(', ')}`,
            'error'
         );

      if (categoryShortcut === 'off') {
         if (!client.room.trainCategory)
            return client.room.sendMessage(
               'Le mode entraînement est déjà désactivé.',
               'error'
            );

         client.room.trainCategory = null;
         client.room.notCountStats = false;
         client.room.mode = 'normal';
         client.room.setRules(constants.DEFAULT_RULES);
         client.room.sendMessage(
            'Le mode entraînement est désactivé, les statistiques seront de nouveau sauvegardées.'
         );
      } else {
         const category: WordCategory = CATEGORY_SHORTCUTS[categoryShortcut];

         if (client.room.trainCategory === category)
            return client.room.sendMessage(
               `Le mode entraînement est déjà activé pour: ${constants.WORD_CATEGORY_NAMES_PLURAL[category]}.`,
               'error'
            );

         client.room.trainCategory = category;
         client.room.notCountStats = {
            reason: 'TRAIN_MODE'
         };
         client.room.setRules(constants.TRAIN_RULES);
         client.room.sendMessage(
            `Le mode entraînement est activé pour: ${constants.WORD_CATEGORY_NAMES_PLURAL[category]}, les statistiques ne seront pas sauvegardées.`
         );
      }
   }
);
