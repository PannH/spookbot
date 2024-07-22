import { Round, Event, Chatter } from '../../classes';
import type { SetupRules, Player } from '../../interfaces';
import type { ChatterRole, Milestone } from '../../types';

interface SetupData {
   constants: {
      maxBombDuration: number;
      maxPlayers: number;
      maxWordLenght: number;
      minBombDuration: number;
      minPlayers: number;
      startTimeDuration: number;
      submitRateLimit: {
         interval: number;
         max: number;
      };
   };
   leaderPeerId: number;
   milestone: Milestone;
   players: Player[];
   rules: SetupRules;
   selfPeerId: number;
   selfRoles: ChatterRole[];
   serverNow: number;
}

export default new Event('setup', (client, setup: SetupData) => {
   switch (setup.milestone.name) {
      case 'round': {
         client.room.round = new Round(setup.milestone, client);

         setup.milestone.currentPlayerPeerId === setup.selfPeerId &&
            client.gameSocket.emit('selfTurn', setup.milestone.syllable);

         break;
      }

      case 'seating': {
         client.room.joinRound();

         client.room.seatingChatters = setup.players.map(
            (player) => new Chatter(player.profile, client)
         );

         break;
      }
   }
});
