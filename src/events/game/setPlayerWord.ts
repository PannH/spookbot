import { Event } from '../../classes';

export default new Event(
   'setPlayerWord',
   (client, playerPeerId: number, word: string) => {
      client.room.round.rawCurrentWord = word;
   }
);
