import { Event } from '../../classes';

export default new Event(
   {
      name: 'roundEnd'
   },
   (client) => {
      if (client.room.round) client.room.round.hasEnded = true;

      client.room.joinRound();
   }
);
