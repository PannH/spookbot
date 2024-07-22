import { Event } from '../../classes';

export default new Event('clearUsedWords', (client) => {
   if (!client.room.round) return;

   client.room.round.usedWords.clear();
});
