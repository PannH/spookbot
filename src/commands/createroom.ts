import { Client, Command } from '../classes';
import globals from '../globals';

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
      const existingRoom = await globals.prisma.activeRoom.findUnique({
         where: {
            ownerAuthId: message.chatter.authId
         }
      });

      if (existingRoom)
         return client.room.sendMessage(
            `${message.chatter.nickname}, vous avez déjà une salle: https://jklm.fun/${existingRoom.code}`,
            'error'
         );

      const roomPrivacy = args[0];
      const isPublic = !(roomPrivacy === 'private' || roomPrivacy === 'pv');

      const newClient = new Client();

      const newRoomCode = await newClient.createRoom({
         name: process.env.PLAYER_ROOM_NAME_TEMPLATE.replace(
            '{username}',
            message.chatter.nickname
         ),
         ownerAuthId: message.chatter.authId,
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
