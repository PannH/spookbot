import type { AlphabetLetter, PromptDifficulty } from '../types';

export default interface Rules {
   dictionaryId: string;
   promptDifficulty: PromptDifficulty;
   customPromptDifficulty: number;
   minTurnDuration: number;
   maxPromptAge: number;
   startingLives: number;
   maxLives: number;
   maxPlayers: number;
   customBonusAlphabet: Record<AlphabetLetter, number>;
}
