import { Command } from '../classes';

export default new Command(
   {
      name: 'kill',
      description: 'Détruire la room actuelle.',
      usageFormats: ['/kill'],
      roomOwnerOnly: true
   },
   (client, message) => {
      client.room.sendMessage('Destruction de la salle...');
      client.room.destroy();
      client.room = null;
   }
);
