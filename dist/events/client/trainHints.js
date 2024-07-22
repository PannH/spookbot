"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const globals_1 = require("../../globals");
const constants_1 = require("../../constants");
const shuffle_1 = __importDefault(require("lodash/shuffle"));
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const functions_1 = require("../../functions");
exports.default = new classes_1.Event('trainHints', async (client, syllable) => {
    client.room.round.isIdle = true;
    const hintWords = await globals_1.dictionary.searchWords(syllable, {
        excludeSet: client.room.round.usedWords,
        withCategories: [
            constants_1.TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]
        ]
    });
    if (!hintWords.length) {
        client.room.sendMessage(`✖️ Aucun ${constants_1.TRAIN_CATEGORY_NAME_SINGULAR[client.room.trainCategory]} pour ${client.room.round.previousSyllable.toUpperCase()}.`);
    }
    else {
        const words = (0, shuffle_1.default)(hintWords)
            .slice(0, 5)
            .map((word) => word.toUpperCase());
        client.room.sendMessage(`💡 ${(0, capitalize_1.default)(constants_1.TRAIN_CATEGORY_NAME_PLURAL[client.room.trainCategory])} pour ${client.room.round.previousSyllable.toUpperCase()} (${(0, functions_1.compactNumber)(hintWords.length)}): ${words.join(', ')}`);
    }
});
