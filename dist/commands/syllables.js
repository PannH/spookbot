"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const functions_1 = require("../functions");
const globals_1 = require("../globals");
const deburr_1 = __importDefault(require("lodash/deburr"));
exports.default = new classes_1.Command({
    name: 'syllables',
    aliases: ['syl'],
    description: "Voir les syllabes et leur rareté d'un mot",
    usageFormats: ['/syl [mot]'],
    usageExamples: ['/syl wahhabisme']
}, async (client, message) => {
    const word = (0, deburr_1.default)(message.args[0]?.toLowerCase());
    if (!word)
        return client.room.sendMessage('Veuillez spécifier un mot.', 'danger');
    if (!globals_1.dictionary.hasWord(word))
        return client.room.sendMessage(`Le mot ${word.toUpperCase()} est inconnu.`, 'danger');
    const syllables = (0, functions_1.getSyllables)(word);
    const syllableRarities = (await Promise.all(syllables.map(async (syl) => ({
        syllable: syl,
        wordsCount: (await globals_1.dictionary.searchWords(syl)).length
    })))).sort((a, b) => a.wordsCount - b.wordsCount);
    client.room.sendMessage(`Syllabes de ${word.toUpperCase()} (${syllables.length}): ${syllableRarities.map(({ syllable, wordsCount }) => `${syllable.toUpperCase()} (${wordsCount})`).join(', ')}.`);
});
