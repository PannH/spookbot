import { Event } from '../../classes';

export default new Event(
   {
      name: 'roundEnd'
   },
   (client) => {
      client.room.round = null;
      client.room.joinRound();
   }
);
