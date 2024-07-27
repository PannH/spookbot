import { Command } from '../classes';
import type { Playstyle } from '../types';

export default new Command(
   {
      name: 'playstyle',
      aliases: ['ps'],
      description: 'Modifier le style de jeu du bot.',
      usageFormats: ['/playstyle [style]'],
      usageExamples: ['/playstyle reverse'],
      roomOwnerOnly: true,
      metaFields: [
         {
            title: 'Styles',
            content: 'normal, human, reverse, crypted'
         }
      ]
   },
   (client, message) => {
      const playstyleQuery = message.args[0]?.toLowerCase() as Playstyle;

      const PLAYSTYLES: Playstyle[] = ['normal', 'human', 'reverse', 'crypted'];

      if (!playstyleQuery || !PLAYSTYLES.includes(playstyleQuery))
         return client.room.sendMessage(
            `Veuillez spécifier un style de jeu parmi: ${PLAYSTYLES.join(', ')}.`,
            'danger'
         );

      if (client.room.playstyle === playstyleQuery)
         return client.room.sendMessage(
            `Le style de jeu est déjà défini sur "${playstyleQuery}".`,
            'danger'
         );

      client.room.playstyle = playstyleQuery;

      client.room.sendMessage(
         `Style de jeu appliqué: ${client.room.playstyle}.`,
         'success'
      );
   }
);
