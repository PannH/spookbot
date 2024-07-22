import { Command } from '../classes';

export default new Command(
   {
      name: 'startnow',
      description: 'Démarrer la partie directement.',
      aliases: ['sn'],
      usageFormats: ['/startnow'],
      roomOwnerOnly: true,
      inSeatingOnly: true
   },
   (client, message) => {
      if (client.room.seatingChatters.length < 2)
         return client.room.sendMessage(
            'Il faut au moins 2 joueurs pour démarrer la partie.',
            'danger'
         );

      client.room.startRound();
      client.room.sendMessage('Lancement de la partie.', 'success');
   }
);
