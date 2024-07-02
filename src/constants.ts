import type { StaffRole } from '@prisma/client';
import type { Rules } from './interfaces';
import type { Optional, Role, WordCategory } from './types';

export default {
   DEFAULT_RULES: {
      dictionaryId: 'fr',
      promptDifficulty: 'custom',
      customPromptDifficulty: 1,
      minTurnDuration: 5,
      maxPromptAge: 16,
      startingLives: 2,
      maxLives: 3
   } satisfies Optional<Rules>,
   ROLE_NAMES: {
      bot: '🤖 Bot',
      leader: '👑 Hôte',
      moderator: '⚔️ Modérateur',
      creator: '🎪 Créateur',
      staff: '⭐ Staff',
      banned: '⛔ Banni'
   } satisfies Record<Role, string>,
   STAFF_ROLE_NAMES: {
      ADMIN: 'Admin',
      TRUSTED: 'Trusted',
      DICTIONARY_MANAGER: 'Gérant Dico'
   } satisfies Record<StaffRole, string>,
   WORD_CATEGORY_NAMES: {
      adverb: 'adverbe',
      creature: 'créature',
      ethnonym: 'ethnonyme',
      hyphen: 'mot composé',
      long: 'mot long',
      plant: 'plante'
   } satisfies Record<WordCategory, string>,
   WORD_CATEGORY_NAMES_WITH_ARTICLE: {
      adverb: 'un adverbe',
      creature: 'une créature',
      ethnonym: 'un ethnonyme',
      hyphen: 'un mot composé',
      long: 'un mot long',
      plant: 'une plante'
   } satisfies Record<WordCategory, string>
} as const;
