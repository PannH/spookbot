import type { AlphaLetter } from '../types';

export interface PlayerState {
   bonusLetters: Record<AlphaLetter, number>;
   lives: number;
   wasWordValidated: boolean;
   word: string;
}
