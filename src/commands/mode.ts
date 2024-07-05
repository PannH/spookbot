import { Command } from '../classes';
import constants from '../constants';
import type { Mode } from '../types';

export default new Command(
   {
      name: 'mode',
      description: 'Changer le mode de jeu.',
      usage: {
         formats: ['/mode <mode>'],
         examples: ['/mode hard', '/mode turbo']
      },
      roomOwnerOnly: true,
      onlyInSeating: true
   },
   async (client, message, args) => {
      const ALLOWED_MODES = Object.keys(constants.MODE_RULES);
      if (!args[0])
         return client.room.sendMessage(
            `Veuillez indiquer un mode parmi: ${ALLOWED_MODES.join(', ')}`,
            'error'
         );

      const mode = args[0].toLowerCase() as Mode;

      if (!ALLOWED_MODES.includes(mode))
         return client.room.sendMessage(
            `Mode "${mode}" inconnu, veuillez choisir parmi: ${ALLOWED_MODES.join(', ')}`,
            'error'
         );

      const modeRules = constants.MODE_RULES[mode];

      client.room.setRules(modeRules);
      client.room.mode = mode;
      client.room.notCountStats = false;
      client.room.trainCategory = null;
      client.room.sendMessage(`Mode de jeu appliqué: ${mode}.`);
   }
);
