import { type Chatter, Event, Message } from '../../classes';
import type { ChatterProfileData } from '../../interfaces';

export default new Event(
   {
      name: 'chat'
   },
   async (
      client,
      chatterProfile: ChatterProfileData,
      content: string,
      customProperties: Record<string, string>
   ) => {
      const chatter = await client.room.getChatter(chatterProfile.peerId);

      if (!chatter) return;

      const message = new Message(chatter, content, client);
      client.emit('chat', message);
   }
);
