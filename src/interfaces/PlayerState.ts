import type { AlphabetLetter } from '../types';

export default interface PlayerState {
   bonusLetters: Record<AlphabetLetter, number>;
   lives: number;
   wasWordValidated: boolean;
   word: string;
}
