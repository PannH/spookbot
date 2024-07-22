"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const deburr_1 = __importDefault(require("lodash/deburr"));
const globals_1 = require("../globals");
const conjugations_json_1 = __importDefault(require("french-verbs-lefff/dist/conjugations.json"));
const functions_1 = require("../functions");
exports.default = new classes_1.Command({
    name: 'dictionary',
    aliases: ['dict'],
    description: 'Gérer le dictionnaire.',
    usageFormats: [
        '/dict add [mot1] [mot2] [...]',
        '/dict remove [mot1] [mot2] [...]',
        '/dict conjug [verbe]'
    ],
    usageExamples: [
        '/dict add hippoboscide hippoboscides',
        '/dict remove samsung',
        '/dict conjug annihiler'
    ],
    dictionaryManagerOnly: true
}, (client, message) => {
    const subcommand = message.args.shift();
    const SUBCOMMANDS = ['add', 'remove', 'conjug'];
    if (!subcommand || !SUBCOMMANDS.includes(subcommand))
        return client.room.sendMessage(`Veuillez choisir parmi ces sous-commandes: ${SUBCOMMANDS.join(', ')}.`, 'danger');
    if (!message.args.length)
        return client.room.sendMessage('Veuillez spécifier au moins un mot.', 'danger');
    switch (subcommand) {
        case 'add': {
            const words = (0, functions_1.removeDuplicates)(message.args.map((arg) => (0, deburr_1.default)(arg.toLowerCase())));
            const unknownWords = words.filter((word) => !globals_1.dictionary.hasWord(word));
            if (!unknownWords.length)
                return client.room.sendMessage('Tous ces mots sont déjà dans le dictionnaire.', 'danger');
            globals_1.dictionary.addWords(unknownWords, message.chatter.profile.auth?.id);
            client.room.sendMessage(`[+] ${unknownWords.map((w) => w.toUpperCase()).join(', ')}`, 'success');
            break;
        }
        case 'remove': {
            const words = (0, functions_1.removeDuplicates)(message.args.map((arg) => (0, deburr_1.default)(arg.toLowerCase())));
            const knownWords = words.filter((word) => globals_1.dictionary.hasWord(word));
            if (!knownWords.length)
                return client.room.sendMessage("Aucun de ces mots n'est dans le dictionnaire.", 'danger');
            globals_1.dictionary.removeWords(knownWords, message.chatter.profile.auth?.id);
            client.room.sendMessage(`[-] ${knownWords.map((w) => w.toUpperCase()).join(', ')}`, 'danger');
            break;
        }
        case 'conjug': {
            if (message.args.length > 1)
                return client.room.sendMessage("Veuillez ne spécifier qu'un seul verbe.", 'danger');
            const verb = message.args[0].toLowerCase();
            const rawConjugations = conjugations_json_1.default[verb];
            if (!rawConjugations)
                return client.room.sendMessage("Ce verbe n'est pas dans le dictionnaire de conjugaison, n'oubliez pas les accents du mot et l'infinitif.", 'danger');
            const conjugations = (0, functions_1.removeDuplicates)(Object.values(conjugations_json_1.default[verb]).flat())
                .filter((c) => c !== 'NA')
                .map((c) => (0, deburr_1.default)(c));
            const unknownConjugations = conjugations.filter((c) => !globals_1.dictionary.hasWord(c));
            if (!unknownConjugations.length)
                return client.room.sendMessage('Toutes les conjugaisons de ce verbe sont déjà dans le dictionnaire.', 'danger');
            globals_1.dictionary
                .addWords(unknownConjugations, message.chatter.profile.auth?.id)
                .catch(() => { });
            client.room.sendMessage(`[+] ${unknownConjugations.map((c) => c.toUpperCase()).join(', ')}`, 'success');
            break;
        }
    }
});
