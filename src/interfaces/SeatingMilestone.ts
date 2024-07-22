import type { DictionaryManifest } from '.';

export interface SeatingMilestone {
   name: 'seating';
   rulesLocked: boolean;
   dictionaryManifest: DictionaryManifest;
   lastRound: {
      winner: {
         nickname: string;
         peerId: number;
         picture: string;
      };
   };
}
