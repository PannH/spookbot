import { Command } from '../classes';
import type { Mode } from '../types';

export default new Command(
   {
      name: 'mode',
      description: 'Changer le mode de jeu.',
      usageFormats: ['/mode [mode]'],
      usageExamples: ['/mode sub500'],
      inSeatingOnly: true,
      roomOwnerOnly: true,
      metaFields: [
         {
            title: 'Modes',
            content: 'normal, easy, turbo, survival, sub500, sub50'
         }
      ]
   },
   (client, message) => {
      const MODES: Mode[] = [
         'normal',
         'easy',
         'turbo',
         'survival',
         'sub500',
         'sub50'
      ];

      const targetMode = message.args[0]?.toLowerCase() as Mode;

      if (!MODES.includes(targetMode))
         return client.room.sendMessage(
            `Veuillez choisir un mode parmi: ${MODES.join(', ')}.`,
            'danger'
         );

      if (targetMode === client.room.mode)
         return client.room.sendMessage(
            'Ce mode de jeu est déjà actif.',
            'danger'
         );

      client.room.setMode(targetMode);
      client.room.sendMessage(
         `Mode de jeu appliqué: ${targetMode}.`,
         'success'
      );
      client.room.registerStats = true;
      client.room.notRegisterStatsReason = null;
   }
);
