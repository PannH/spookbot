import { Event, Client } from '../../classes';

export default new Event(
   {
      name: 'createRoom'
   },
   async (
      client,
      userId: string,
      username: string,
      callback: (roomCode: string) => void
   ) => {
      const newClient = new Client();

      const newRoomCode = await newClient.createRoom({
         name: process.env.PLAYER_ROOM_NAME_TEMPLATE.replace(
            '{username}',
            username
         ),
         ownerAuthId: userId
      });

      callback(newRoomCode);

      await newClient.joinRoom(newRoomCode);
      newClient.room.joinRound();
      newClient.room.setDefaultRules();
   }
);
