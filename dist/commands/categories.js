"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const constants_1 = require("../constants");
const functions_1 = require("../functions");
const globals_1 = require("../globals");
const deburr_1 = __importDefault(require("lodash/deburr"));
exports.default = new classes_1.Command({
    name: 'categories',
    aliases: ['cat'],
    description: "Voir les catégories d'un mot.",
    usageFormats: ['/cat [mot]'],
    usageExamples: ['/cat chauve-souris']
}, async (client, message) => {
    const word = (0, deburr_1.default)(message.args[0]?.toLowerCase());
    if (!word)
        return client.room.sendMessage('Veuillez spécifier un mot.', 'danger');
    if (!globals_1.dictionary.hasWord(word))
        return client.room.sendMessage(`Le mot ${word.toUpperCase()} est inconnu.`, 'danger');
    const categories = globals_1.dictionary.getWordCategories(word);
    if (!categories.length)
        return client.room.sendMessage(`Le mot ${word.toUpperCase()} n'a aucune catégorie.`);
    client.room.sendMessage(`${(0, functions_1.pluralize)(categories.length, 'Catégorie')} de ${word.toUpperCase()}: ${categories.map((cat) => constants_1.CATEGORY_NAME[cat]).join(', ')}.`);
});
