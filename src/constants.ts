import type { Rules } from './interfaces';
import type { Optional } from './types';

export default {
   DEFAULT_RULES: {
      dictionaryId: 'fr',
      promptDifficulty: 'custom',
      customPromptDifficulty: 1,
      minTurnDuration: 5,
      maxPromptAge: 16,
      startingLives: 2,
      maxLives: 3
   } satisfies Optional<Rules>
} as const;
