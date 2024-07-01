import type { AlphabetLetter, PromptDifficulty } from '../types';

export default interface DictionaryManifest {
   name: string;
   promptDifficulties: Record<Exclude<PromptDifficulty, 'custom'>, number>;
   bonusAlphabet: Record<AlphabetLetter, number>;
}
