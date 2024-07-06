import { Event } from '../../classes';
import globals from '../../globals';

export default new Event(
   {
      name: 'nextTurn'
   },
   async (client, peerId: number, syllable: string) => {
      client.room.round.previousSyllable = client.room.round.syllable;
      client.room.round.syllable = syllable;

      if (peerId === client.room.selfPeerId) client.emit('selfTurn');
   }
);
