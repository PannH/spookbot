"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECORD_CATEGORY_NAME = exports.CATEGORY_SHORTCUT_TO_CATEGORY = exports.MODE_FLAG_TO_MODE = exports.PROFILE_ROLE_NAME = exports.STAT_COINS_WORTH = exports.TRAIN_CATEGORY_TO_WORD_CATEGORY = exports.TRAIN_CATEGORY_NAME_PLURAL = exports.TRAIN_CATEGORY_NAME_SINGULAR = exports.TRAIN_RULES = exports.NOT_REGISTER_STATS_REASON = exports.MODE_RULES = exports.STAT_NAME = exports.ALPHA_LETTERS = exports.CATEGORY_NAME_WITH_ARTICLE = exports.CATEGORY_NAME = exports.CATEGORY_TO_STAT = exports.DEFAULT_ROUND_PLAYER_STATS = exports.DEFAULT_RULES = exports.COMMAND_PREFIXES = void 0;
const COMMAND_PREFIXES = ['!', '/', '.'];
exports.COMMAND_PREFIXES = COMMAND_PREFIXES;
const DEFAULT_RULES = {
    dictionaryId: 'fr',
    promptDifficulty: 'custom',
    customPromptDifficulty: 1,
    minTurnDuration: 5,
    startingLives: 2,
    maxLives: 3,
    maxPromptAge: 16
};
exports.DEFAULT_RULES = DEFAULT_RULES;
const DEFAULT_ROUND_PLAYER_STATS = {
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
    bonusWords: 0
};
exports.DEFAULT_ROUND_PLAYER_STATS = DEFAULT_ROUND_PLAYER_STATS;
const CATEGORY_TO_STAT = {
    adverb: 'adverbs',
    creature: 'creatures',
    ethnonym: 'ethnonyms',
    hyphen: 'hyphens',
    long: 'longs',
    plant: 'plants',
    alpha: 'alpha',
    bonus: 'bonusWords'
};
exports.CATEGORY_TO_STAT = CATEGORY_TO_STAT;
const STAT_NAME = {
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
    bonusWords: 'mots bonus'
};
exports.STAT_NAME = STAT_NAME;
const CATEGORY_NAME = {
    adverb: 'adverbe',
    creature: 'créature',
    ethnonym: 'ethnonyme',
    hyphen: 'mot composé',
    long: 'mot long',
    plant: 'plante',
    alpha: 'alpha',
    bonus: 'mot bonus'
};
exports.CATEGORY_NAME = CATEGORY_NAME;
const CATEGORY_NAME_WITH_ARTICLE = {
    adverb: 'un adverbe',
    creature: 'une créature',
    ethnonym: 'un ethnonyme',
    hyphen: 'un mot composé',
    long: 'un mot long',
    plant: 'une plante',
    alpha: 'un alpha',
    bonus: 'le mot bonus'
};
exports.CATEGORY_NAME_WITH_ARTICLE = CATEGORY_NAME_WITH_ARTICLE;
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
exports.ALPHA_LETTERS = ALPHA_LETTERS;
const MODE_RULES = {
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
exports.MODE_RULES = MODE_RULES;
const NOT_REGISTER_STATS_REASON = {
    customRules: 'les règles sont modifiées',
    trainMode: 'le mode entraînement est actif'
};
exports.NOT_REGISTER_STATS_REASON = NOT_REGISTER_STATS_REASON;
const TRAIN_RULES = {
    customPromptDifficulty: 1,
    minTurnDuration: 10,
    startingLives: 3,
    maxLives: 3,
    maxPromptAge: 1
};
exports.TRAIN_RULES = TRAIN_RULES;
const TRAIN_CATEGORY_NAME_SINGULAR = {
    adverbs: 'adverbe',
    creatures: 'créature',
    ethnonyms: 'ethnonyme',
    hyphens: 'mot composé',
    longs: 'mot long',
    plants: 'plante'
};
exports.TRAIN_CATEGORY_NAME_SINGULAR = TRAIN_CATEGORY_NAME_SINGULAR;
const TRAIN_CATEGORY_NAME_PLURAL = {
    adverbs: 'adverbes',
    creatures: 'créatures',
    ethnonyms: 'ethnonymes',
    hyphens: 'mots composés',
    longs: 'mots longs',
    plants: 'plantes'
};
exports.TRAIN_CATEGORY_NAME_PLURAL = TRAIN_CATEGORY_NAME_PLURAL;
const TRAIN_CATEGORY_TO_WORD_CATEGORY = {
    adverbs: 'adverb',
    creatures: 'creature',
    ethnonyms: 'ethnonym',
    hyphens: 'hyphen',
    longs: 'long',
    plants: 'plant'
};
exports.TRAIN_CATEGORY_TO_WORD_CATEGORY = TRAIN_CATEGORY_TO_WORD_CATEGORY;
const STAT_COINS_WORTH = {
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
    bonusWords: 0.1
};
exports.STAT_COINS_WORTH = STAT_COINS_WORTH;
const PROFILE_ROLE_NAME = {
    admin: 'Admin',
    dictionaryManager: 'Gérant dico',
    trusted: 'Trusted'
};
exports.PROFILE_ROLE_NAME = PROFILE_ROLE_NAME;
const MODE_FLAG_TO_MODE = {
    '-normal': 'normal',
    '-turbo': 'turbo',
    '-easy': 'easy',
    '-survival': 'survival',
    '-sub500': 'sub500',
    '-sub50': 'sub50'
};
exports.MODE_FLAG_TO_MODE = MODE_FLAG_TO_MODE;
const CATEGORY_SHORTCUT_TO_CATEGORY = {
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
exports.CATEGORY_SHORTCUT_TO_CATEGORY = CATEGORY_SHORTCUT_TO_CATEGORY;
const RECORD_CATEGORY_NAME = {
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
exports.RECORD_CATEGORY_NAME = RECORD_CATEGORY_NAME;
