import type { RoundPlayerStats, Rules, ShopItem } from './interfaces';
import type {
   Mode,
   NotRegisterStatsReason,
   Optional,
   ProfileRole,
   RecordCategory,
   TrainCategory,
   WordCategory
} from './types';

const COMMAND_PREFIXES = ['!', '/', '.'];

const DEFAULT_RULES: Optional<Rules> = {
   dictionaryId: 'fr',
   promptDifficulty: 'custom',
   customPromptDifficulty: 1,
   minTurnDuration: 5,
   startingLives: 2,
   maxLives: 3,
   maxPromptAge: 16
};

const DEFAULT_ROUND_PLAYER_STATS: RoundPlayerStats = {
   lifetime: 0,
   words: 0,
   hyphens: 0,
   longs: 0,
   ethnonyms: 0,
   adverbs: 0,
   plants: 0,
   creatures: 0,
   lives: 0,
   alpha: 0,
   fuckedSyllables: 0,
   bonusWords: 0,
   patterns: 0
};

const CATEGORY_TO_STAT: Record<WordCategory, keyof RoundPlayerStats> = {
   adverb: 'adverbs',
   creature: 'creatures',
   ethnonym: 'ethnonyms',
   hyphen: 'hyphens',
   long: 'longs',
   plant: 'plants',
   alpha: 'alpha',
   bonus: 'bonusWords'
};

const STAT_NAME: Record<keyof RoundPlayerStats, string> = {
   adverbs: 'adverbes',
   alpha: 'alpha',
   creatures: 'créatures',
   ethnonyms: 'ethnonymes',
   fuckedSyllables: 'syllabes niquées',
   hyphens: 'mots composés',
   lifetime: 'temps',
   lives: 'vies gagnées',
   longs: 'mots longs',
   plants: 'plantes',
   words: 'mots',
   bonusWords: 'mots bonus',
   patterns: 'patterns'
};

const CATEGORY_NAME: Record<WordCategory, string> = {
   adverb: 'adverbe',
   creature: 'créature',
   ethnonym: 'ethnonyme',
   hyphen: 'mot composé',
   long: 'mot long',
   plant: 'plante',
   alpha: 'alpha',
   bonus: 'mot bonus'
};

const CATEGORY_NAME_WITH_ARTICLE: Record<WordCategory, string> = {
   adverb: 'un adverbe',
   creature: 'une créature',
   ethnonym: 'un ethnonyme',
   hyphen: 'un mot composé',
   long: 'un mot long',
   plant: 'une plante',
   alpha: 'un alpha',
   bonus: 'le mot bonus'
};

const ALPHA_LETTERS = [
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
];

const MODE_RULES: Record<Mode, Optional<Rules>> = {
   normal: DEFAULT_RULES,
   easy: {
      customPromptDifficulty: 500,
      minTurnDuration: 7,
      startingLives: 3,
      maxLives: 3,
      maxPromptAge: 16
   },
   turbo: {
      customPromptDifficulty: 1,
      minTurnDuration: 3,
      startingLives: 2,
      maxLives: 3,
      maxPromptAge: 16
   },
   survival: {
      customPromptDifficulty: 1,
      minTurnDuration: 5,
      startingLives: 1,
      maxLives: 1,
      maxPromptAge: 1
   },
   sub500: {
      customPromptDifficulty: -500,
      minTurnDuration: 5,
      startingLives: 2,
      maxLives: 3,
      maxPromptAge: 16
   },
   sub50: {
      customPromptDifficulty: -50,
      minTurnDuration: 5,
      startingLives: 2,
      maxLives: 3,
      maxPromptAge: 16
   }
};

const NOT_REGISTER_STATS_REASON: Record<NotRegisterStatsReason, string> = {
   customRules: 'les règles sont modifiées',
   trainMode: 'le mode entraînement est actif'
};

const TRAIN_RULES: Optional<Rules> = {
   customPromptDifficulty: 1,
   minTurnDuration: 10,
   startingLives: 3,
   maxLives: 3,
   maxPromptAge: 1
};

const TRAIN_CATEGORY_NAME_SINGULAR: Record<TrainCategory, string> = {
   adverbs: 'adverbe',
   creatures: 'créature',
   ethnonyms: 'ethnonyme',
   hyphens: 'mot composé',
   longs: 'mot long',
   plants: 'plante',
   patterns: 'pattern'
};

const TRAIN_CATEGORY_NAME_PLURAL: Record<TrainCategory, string> = {
   adverbs: 'adverbes',
   creatures: 'créatures',
   ethnonyms: 'ethnonymes',
   hyphens: 'mots composés',
   longs: 'mots longs',
   plants: 'plantes',
   patterns: 'patterns'
};

const TRAIN_CATEGORY_TO_WORD_CATEGORY: Record<TrainCategory, WordCategory> = {
   adverbs: 'adverb',
   creatures: 'creature',
   ethnonyms: 'ethnonym',
   hyphens: 'hyphen',
   longs: 'long',
   plants: 'plant',
   patterns: null
};

const STAT_COINS_WORTH: Record<keyof RoundPlayerStats, number> = {
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
   lifetime: 0.000001,
   bonusWords: 0.1,
   patterns: 0.2
};

const PROFILE_ROLE_NAME: Record<ProfileRole, string> = {
   admin: 'Admin',
   dictionaryManager: 'Gérant dico',
   trusted: 'Trusted'
};

const MODE_FLAG_TO_MODE: Record<string, Mode> = {
   '-normal': 'normal',
   '-turbo': 'turbo',
   '-easy': 'easy',
   '-survival': 'survival',
   '-sub500': 'sub500',
   '-sub50': 'sub50'
};

const CATEGORY_SHORTCUT_TO_CATEGORY: Record<string, RecordCategory> = {
   mc: 'hyphens',
   l: 'longs',
   eth: 'ethnonyms',
   adv: 'adverbs',
   pl: 'plants',
   cr: 'creatures',
   a: 'alpha',
   v: 'lives',
   t: 'lifetime',
   m: 'words',
   sn: 'fuckedSyllables',
   mb: 'bonusWords'
};

const RECORD_CATEGORY_NAME: Record<RecordCategory, string> = {
   lifetime: 'temps',
   words: 'mots',
   lives: 'vies gagnées',
   hyphens: 'mots composés',
   longs: 'mots longs',
   ethnonyms: 'ethnonymes',
   adverbs: 'adverbes',
   plants: 'plantes',
   creatures: 'créatures',
   fuckedSyllables: 'syllabes niquées',
   alpha: 'alpha',
   bonusWords: 'mots bonus'
};

const SHOP_ITEMS: ShopItem[] = [
   {
      id: 1,
      name: 'Pseudo',
      price: 700
   },
   {
      id: 2,
      name: 'Avatar',
      price: 800
   },
   {
      id: 3,
      name: 'Couleur des messages',
      price: 500
   },
   {
      id: 4,
      name: "Message d'accueil",
      price: 500
   },
   {
      id: 5,
      name: 'Nom de salle',
      price: 800
   }
];

export {
   COMMAND_PREFIXES,
   DEFAULT_RULES,
   DEFAULT_ROUND_PLAYER_STATS,
   CATEGORY_TO_STAT,
   CATEGORY_NAME,
   CATEGORY_NAME_WITH_ARTICLE,
   ALPHA_LETTERS,
   STAT_NAME,
   MODE_RULES,
   NOT_REGISTER_STATS_REASON,
   TRAIN_RULES,
   TRAIN_CATEGORY_NAME_SINGULAR,
   TRAIN_CATEGORY_NAME_PLURAL,
   TRAIN_CATEGORY_TO_WORD_CATEGORY,
   STAT_COINS_WORTH,
   PROFILE_ROLE_NAME,
   MODE_FLAG_TO_MODE,
   CATEGORY_SHORTCUT_TO_CATEGORY,
   RECORD_CATEGORY_NAME,
   SHOP_ITEMS
};
