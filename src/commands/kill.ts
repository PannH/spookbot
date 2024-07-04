import { Command } from '../classes';
import globals from '../globals';

export default new Command(
   {
      name: 'kill',
      description: 'Détruire la salle actuelle.',
      usage: {
         formats: ['/kill']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      client.room.sendMessage('Destruction de la salle...');

      await globals.prisma.activeRoom.delete({
         where: {
            code: client.room.code
         }
      });

      client.room.leave();

      client.gameSocket.disconnect();
      client.roomSocket.disconnect();
   }
);
