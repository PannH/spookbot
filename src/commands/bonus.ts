import { Command } from '../classes';

export default new Command(
   {
      name: 'bonus',
      description: 'Afficher le mot bonus actuel.',
      usageFormats: ['/bonus']
   },
   (client, message) => {
      if (!client.room.round || client.room.round.isOver)
         return client.room.sendMessage('Aucune partie en cours.', 'danger');

      if (!client.room.round.currentBonusWord)
         return client.room.sendMessage(
            "Aucun mot bonus pour l'instant.",
            'danger'
         );

      client.room.sendMessage(
         `Mot bonus actuel: ${client.room.round.currentBonusWord.toUpperCase()}.`
      );
   }
);
