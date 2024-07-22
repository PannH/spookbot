import type { AlphaLetter, PromptDifficulty } from '../types';

export interface Rules {
   dictionaryId: string;
   promptDifficulty: PromptDifficulty;
   customPromptDifficulty: number;
   minTurnDuration: number;
   maxPromptAge: number;
   startingLives: number;
   maxLives: number;
   maxPlayers: number;
   customBonusAlphabet: Record<AlphaLetter, number>;
}
