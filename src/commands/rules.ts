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
            '/rules <preset>',
            '/rules <difficulté_syllabe> <durée_tour> <âge_syllabes> <vies_début> <vies_max>'
         ],
         examples: ['/rules sub100', '/rules 1 5 16 2 3']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      const ALLOWED_RULE_PRESETS: RulePreset[] = [
         'reset',
         'sub1',
         'sub100',
         'sub500',
         'sub1000'
      ];

      if (!args.length)
         return client.room.sendMessage(
            'Veuillez indiquer soit un preset de règles, soit la configuration complète (voir "/help rules").',
            'error'
         );

      if (args.length === 1) {
         const rulePreset = constants.RULE_PRESETS[args[0]];

         if (!rulePreset)
            return client.room.sendMessage(
               `Preset de règles inconnu. Veuillez choisir parmi: ${ALLOWED_RULE_PRESETS.join(', ')}.`,
               'error'
            );

         client.room.setRules(rulePreset);
         client.room.sendMessage(
            'Les règles ont été mises à jour. Les statistiques ne seront pas sauvegardées.'
         );
         client.room.notCountStats = {
            reason: 'CUSTOM_RULES'
         };
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
            'Les règles ont été mises à jour. Les statistiques ne seront pas sauvegardées.'
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
