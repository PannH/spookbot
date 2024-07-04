import { Command } from '../classes';

export default new Command(
   {
      name: 'public',
      description: 'Rendre la salle publique.',
      usage: {
         formats: ['/public']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      if (client.room.isPublic)
         return client.room.sendMessage(
            'Cette salle est déjà publique.',
            'error'
         );

      client.room.setPrivacy(true);

      client.room.sendMessage('La salle est désormais publique.', 'success');
   }
);
