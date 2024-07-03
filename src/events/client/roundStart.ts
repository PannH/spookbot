import { Event, Round } from '../../classes';
import constants from '../../constants';
import type { RoundMilestone } from '../../interfaces';

export default new Event(
   {
      name: 'roundStart'
   },
   (client, milestone: RoundMilestone) => {
      client.room.round = new Round(milestone, client);

      for (const player of client.room.seatingPlayers) {
         if (player.peerId === client.room.selfPeerId) continue;

         client.room.round.playersStats[player.peerId] = structuredClone(
            constants.DEFAULT_PLAYER_STATS
         );
      }
   }
);
