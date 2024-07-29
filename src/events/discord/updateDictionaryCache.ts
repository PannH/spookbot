import { Event } from '../../classes';
import { dictionary } from '../../globals';

export default new Event(
   'createRoom',
   async (
      client,
      authId: string,
      nickname: string,
      callback: (roomCode: string) => void
   ) => {
      dictionary.initCache();
   }
);
