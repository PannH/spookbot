import type { DictionaryManifest, PlayerState } from '.';

export interface RoundMilestone {
   name: 'round';
   currentPlayerPeerId: number;
   promptAge: number;
   startTime: number;
   syllable: string;
   usedWordCount: number;
   dictionaryManifest: DictionaryManifest;
   playerStatesByPeerId: Record<number, PlayerState>;
}
