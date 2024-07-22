import { Chatter, Event } from '../../classes';
import type { Player } from '../../interfaces';

export default new Event('addPlayer', async (client, player: Player) => {
   client.room.seatingChatters.push(new Chatter(player.profile, client));
});
