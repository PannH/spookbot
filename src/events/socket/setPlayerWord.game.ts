import { Event } from '../../classes';
import { simplifyString } from '../../functions';

export default new Event(
   {
      name: 'setPlayerWord'
   },
   async (client, peerId: number, word: string) => {
      client.room.round.currentWord = simplifyString(word);
   }
);
