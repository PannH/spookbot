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

      await client.room.destroy();
   }
);
