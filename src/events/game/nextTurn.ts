import { Event } from '../../classes';

export default new Event(
   'nextTurn',
   (client, peerId: number, syllable: string) => {
      client.room.round.previousSyllable = client.room.round.currentSyllable;
      client.room.round.currentSyllable = syllable;

      if (peerId === client.room.data.selfPeerId) client.emit('selfTurn');
   }
);
