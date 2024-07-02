import type { Milestone, Role } from '../types';
import type { Player, SetupRules } from '.';

export default interface SetupData {
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
   selfRoles: Role[];
   serverNow: number;
}
