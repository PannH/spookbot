"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const deburr_1 = __importDefault(require("lodash/deburr"));
const shuffle_1 = __importDefault(require("lodash/shuffle"));
const safe_regex_1 = __importDefault(require("safe-regex"));
const constants_1 = require("../constants");
const globals_1 = require("../globals");
const functions_1 = require("../functions");
exports.default = new classes_1.Command({
    name: 'searchwords',
    aliases: ['sw', 'c'],
    description: 'Rechercher des mots dans le dictionnaire.',
    usageFormats: ['/c [recherche] [-catégorie1] [-catégorie2] [...]'],
    usageExamples: [
        '/c biolog',
        '/c ^auto-.+',
        '/c -l -adv',
        '/c souris -mc -pl'
    ]
}, async (client, message) => {
    const queries = message.args.map((arg) => (0, deburr_1.default)(arg));
    if (queries.some((query) => !(0, safe_regex_1.default)(query)))
        return client.room.sendMessage('Veuillez ne spécifier que des expressions régulières sûres ou moins complexes.', 'danger');
    if (!queries.length) {
        if (client.room.round && !client.room.round.isOver)
            queries.push(client.room.round.currentSyllable);
        else if (!client.room.round || client.room.round?.isOver)
            queries.push('.');
    }
    const FLAG_TO_CATEGORY = {
        '-mc': 'hyphen',
        '-l': 'long',
        '-adv': 'adverb',
        '-pl': 'plant',
        '-eth': 'ethnonym',
        '-cr': 'creature'
    };
    const categories = message.flags.length
        ? message.flags.map((flag) => FLAG_TO_CATEGORY[flag])
        : [];
    if (categories.some((category) => !category))
        return client.room.sendMessage(`Veuillez spécifier des paramètres valides parmi: ${Object.entries(FLAG_TO_CATEGORY)
            .map(([flag, category]) => `${flag} (${constants_1.CATEGORY_NAME[category]})`)
            .join(', ')}.`, 'danger');
    const matchingWords = (await Promise.all(queries.map((query) => globals_1.dictionary.searchWords(query, {
        withCategories: categories
    })))).flat();
    if (!matchingWords.length)
        return client.room.sendMessage('Aucun mot ne correspond à votre recherche.', 'danger');
    const hiddenWords = new Set(client.room.round &&
        !client.room.round.isOver &&
        client.room.registerStats
        ? matchingWords.filter((word) => word.includes(client.room.round.currentSyllable))
        : []);
    const shownWords = (0, shuffle_1.default)(matchingWords.filter((word) => !hiddenWords.has(word)));
    let messageContent = `${(0, functions_1.compactNumber)(matchingWords.length)} ${(0, functions_1.pluralize)(matchingWords.length, 'mot trouvé', 'mots trouvés')}${hiddenWords.size ? ` (${(0, functions_1.compactNumber)(hiddenWords.size)} ${(0, functions_1.pluralize)(hiddenWords.size, 'caché')})` : ''}: `;
    const MAX_CONTENT_LENGTH = 200;
    if (!shownWords.length) {
        messageContent += 'Tous les mots sont cachés.';
    }
    else {
        while (true) {
            const oldMessageContent = messageContent;
            messageContent += `${messageContent.endsWith(': ') ? '' : ', '}${shownWords.shift().toUpperCase()}`;
            if (!shownWords.length)
                break;
            if (messageContent.length > MAX_CONTENT_LENGTH) {
                messageContent = oldMessageContent;
                break;
            }
        }
    }
    client.room.sendMessage(messageContent);
});
