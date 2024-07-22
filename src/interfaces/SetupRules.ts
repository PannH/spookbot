import type { AlphaLetter, PromptDifficulty } from '../types';

export interface SetupRules {
   customBonusAlphabet: {
      max: number;
      min: number;
      value: Record<AlphaLetter, number>;
   };
   customPromptDifficulty: {
      disallowZero: boolean;
      max: number;
      min: number;
      value: number;
   };
   dictionaryId: {
      items: {
         value: string;
         label: string;
      }[];
      Value: string;
   };
   maxLives: {
      max: number;
      min: number;
      value: number;
   };
   maxPlayers: {
      max: number;
      min: number;
      value: number;
   };
   maxPromptAge: {
      max: number;
      min: number;
      value: number;
   };
   minTurnDuration: {
      max: number;
      min: number;
      value: number;
   };
   promptDifficulty: {
      items: {
         value: PromptDifficulty;
      }[];
      value: PromptDifficulty;
   };
   startingLives: {
      max: number;
      min: number;
      value: number;
   };
}
