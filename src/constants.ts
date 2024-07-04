import type { StaffRole } from '@prisma/client';
import type { PlayerStats, Rules } from './interfaces';
import type { Optional, Role, RulePreset, WordCategory } from './types';

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
   } satisfies Record<WordCategory, string>,
   DEFAULT_PLAYER_STATS: {
      lifetime: null,
      words: 0,
      hyphens: 0,
      longs: 0,
      ethnonyms: 0,
      adverbs: 0,
      plants: 0,
      creatures: 0,
      lives: 0,
      alpha: 0
   } satisfies PlayerStats,
   PLAYER_STAT_NAMES: {
      lifetime: 'temps',
      adverbs: 'adverbes',
      creatures: 'créatures',
      ethnonyms: 'ethnonymes',
      hyphens: 'mots composés',
      longs: 'mots longs',
      plants: 'plantes',
      words: 'mots',
      lives: 'vies gagnées',
      alpha: 'alpha'
   } satisfies Record<keyof PlayerStats, string>,
   RULE_PRESETS: {
      reset: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: 1,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      sub50: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -50,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      sub1: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -1,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      sub100: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -100,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      sub500: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -500,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      sub1000: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -1000,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      }
   } satisfies Record<RulePreset, Optional<Rules>>
} as const;
