import { Event } from '../../classes';

export default new Event(
   {
      name: 'nextTurn'
   },
   async (client, peerId: number, syllable: string) => {
      if (peerId === client.room.selfPeerId) client.emit('selfTurn', syllable);
   }
);
