import type { StaffRole } from '@prisma/client';
import type { PlayerStats, Rules } from './interfaces';
import type {
   AlphabetLetter,
   NotCountStatsReason,
   Optional,
   Role,
   WordCategory,
   Mode
} from './types';

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
      alpha: 0,
      fuckedSyllables: 0
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
      alpha: 'alpha',
      fuckedSyllables: 'syllabes niquées'
   } satisfies Record<keyof PlayerStats, string>,
   ALPHA_LETTERS: [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
   ] satisfies AlphabetLetter[],
   NOT_COUNT_STATS_REASONS: {
      CUSTOM_RULES: 'les règles sont modifiées'
   } satisfies Record<NotCountStatsReason, string>,
   MODE_RULES: {
      normal: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: 1,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      turbo: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: 1,
         minTurnDuration: 3,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      },
      easy: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: 1,
         minTurnDuration: 10,
         maxPromptAge: 16,
         startingLives: 3,
         maxLives: 3
      },
      survival: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: 1,
         minTurnDuration: 5,
         maxPromptAge: 1,
         startingLives: 1,
         maxLives: 1
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
      sub50: {
         dictionaryId: 'fr',
         promptDifficulty: 'custom',
         customPromptDifficulty: -50,
         minTurnDuration: 5,
         maxPromptAge: 16,
         startingLives: 2,
         maxLives: 3
      }
   } satisfies Record<Mode, Optional<Rules>>,
   STATS_COINS_VALUES: {
      words: 0.01,
      hyphens: 0.05,
      longs: 0.05,
      ethnonyms: 0.1,
      adverbs: 0.1,
      plants: 0.2,
      creatures: 0.2,
      alpha: 0.02,
      fuckedSyllables: 0.2,
      lives: 0.1,
      lifetime: 0.000001
   } satisfies Record<keyof PlayerStats, number>
} as const;
