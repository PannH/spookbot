import { Command } from '../classes';

export default new Command(
   {
      name: 'startnow',
      description: 'Lancer la partie directement.',
      aliases: ['sn'],
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      if (client.room.seatingPlayersCount < 2)
         return client.room.sendMessage(
            "Il n'y a pas assez de joueurs.",
            'error'
         );

      client.room.startRound();
      client.room.sendMessage('Lancement de la partie.');
   }
);
