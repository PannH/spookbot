import { Command } from '../classes';

export default new Command(
   {
      name: 'startnow',
      description: 'Lancer la partie directement.',
      aliases: ['sn'],
      usage: {
         formats: ['/sn']
      },
      roomOwnerOnly: true,
      onlyInSeating: true
   },
   async (client, message, args) => {
      if (client.room.round && !client.room.round.hasEnded)
         return client.room.sendMessage(
            'La partie est déjà en cours.',
            'error'
         );

      if (client.room.seatingPlayers.length < 2)
         return client.room.sendMessage(
            "Il n'y a pas assez de joueurs.",
            'error'
         );

      client.room.startRound();
      client.room.sendMessage('Lancement de la partie.');
   }
);
