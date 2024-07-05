import { Command } from '../classes';
import constants from '../constants';
import type { Rules } from '../interfaces';
import type { Optional, RulePreset } from '../types';

export default new Command(
   {
      name: 'rules',
      description: 'Modifier les règles du jeu.',
      usage: {
         formats: [
            '/rules reset',
            '/rules <difficulté_syllabe> <durée_tour> <âge_syllabes> <vies_début> <vies_max>'
         ],
         examples: ['/rules reset', '/rules 1 5 16 2 3']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      if (client.room.round && !client.room.round.hasEnded)
         return client.room.sendMessage(
            'Les règles ne peuvent pas être modifiées en cours de partie.',
            'error'
         );

      if (!args.length)
         return client.room.sendMessage(
            'Veuillez indiquer "reset" ou la configuration complète (voir "/help rules").',
            'error'
         );

      if (args.length === 1) {
         const rulePreset = args[0].toLowerCase();

         if (rulePreset !== 'reset')
            return client.room.sendMessage(
               'Veuillez spécifier "reset" ou une configuration complète pour modifier les règles.',
               'error'
            );

         client.room.setRules(constants.DEFAULT_RULES);
         client.room.sendMessage(
            'Les règles ont été réinitialisées, les statistiques seront de nouveau sauvegardées.'
         );
         client.room.notCountStats = false;
      } else if (args.length === 5) {
         const rules: Optional<Rules> = {
            customPromptDifficulty: Number.parseInt(args[0]),
            minTurnDuration: Number.parseInt(args[1]),
            maxPromptAge: Number.parseInt(args[2]),
            startingLives: Number.parseInt(args[3]),
            maxLives: Number.parseInt(args[4])
         };

         if (Object.values(rules).some((value) => Number.isNaN(value)))
            return client.room.sendMessage(
               'Veuillez indiquer des valeurs numériques valides.',
               'error'
            );

         client.room.setRules(rules);
         client.room.sendMessage(
            'Les règles ont été mises à jour, les statistiques ne seront pas sauvegardées.'
         );
         client.room.notCountStats = {
            reason: 'CUSTOM_RULES'
         };
      } else {
         client.room.sendMessage(
            'Nombre d\'arguments invalide. Veuillez indiquer soit un preset, soit la configuration complète (voir "/help rules")',
            'error'
         );
      }
   }
);
