import { Event, Round } from '../../classes';
import type { RoundMilestone } from '../../interfaces';

export default new Event(
   {
      name: 'roundStart'
   },
   (client, milestone: RoundMilestone) => {
      client.room.round = new Round(milestone, client);
   }
);
