import type { AlphaLetter, PromptDifficulty } from '../types';

export interface DictionaryManifest {
   name: string;
   promptDifficulties: Record<Exclude<PromptDifficulty, 'custom'>, number>;
   bonusAlphabet: Record<AlphaLetter, number>;
}
