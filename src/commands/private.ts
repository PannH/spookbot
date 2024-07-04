import { Command } from '../classes';

export default new Command(
   {
      name: 'private',
      description: 'Rendre la salle privée.',
      usage: {
         formats: ['/private']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      if (!client.room.isPublic)
         return client.room.sendMessage(
            'Cette salle est déjà privée.',
            'error'
         );

      client.room.setPrivacy(false);

      client.room.sendMessage('La salle est désormais privée.', 'success');
   }
);
