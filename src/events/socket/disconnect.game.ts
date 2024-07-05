import { Event } from '../../classes';

export default new Event(
   {
      name: 'disconnect'
   },
   async (client, reason: string) => {
      if (
         reason !== 'io server disconnect' &&
         reason !== 'io client disconnect'
      ) {
         client.gameSocket.connect();
         client.room.joinRound();
      }
   }
);
