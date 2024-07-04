import { Client, Command } from '../classes';

export default new Command(
   {
      name: 'createroom',
      description: 'Créer une nouvelle salle pour vous.',
      aliases: ['cr', 'b'],
      usage: {
         formats: ['/b', '/b pv']
      },
      requireAuth: true
   },
   async (client, message, args) => {
      const roomPrivacy = args[0];
      const isPublic = !(roomPrivacy === 'private' || roomPrivacy === 'pv');

      const newClient = new Client();

      const newRoomCode = await newClient.createRoom({
         name: process.env.PLAYER_ROOM_NAME_TEMPLATE.replace(
            '{username}',
            message.chatter.nickname
         ),
         isPublic
      });

      client.room.sendMessage(
         `${message.chatter.nickname}, voici votre salle: https://jklm.fun/${newRoomCode} (${isPublic ? 'publique' : 'privée'})`
      );

      await newClient.joinRoom(newRoomCode);
      newClient.room.joinRound();
      newClient.room.setDefaultRules();
   }
);
