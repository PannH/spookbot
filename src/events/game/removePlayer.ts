import { Event } from '../../classes';

export default new Event('removePlayer', async (client, playerPeerId) => {
   client.room.seatingChatters = client.room.seatingChatters.filter(
      (chatter) => chatter.profile.peerId !== playerPeerId
   );
});
