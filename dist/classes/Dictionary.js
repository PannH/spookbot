"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const db_1 = require("../services/db");
const functions_1 = require("../functions");
const socket_1 = __importDefault(require("../socket"));
class Dictionary {
    _words = new Set();
    _wordsCategories = new Map();
    async initCache() {
        const words = await (0, db_1.getWords)();
        for (const { value, categories } of words) {
            this._words.add(value);
            if (categories.length)
                this._wordsCategories.set(value, categories);
        }
        console.log(`Dictionary cache initialized (${this._words.size} words)`);
    }
    async searchWords(query, options) {
        if (!this._words.size)
            throw new Error('Dictionary cache not initialized');
        const { excludeSet = new Set(), withCategories = [] } = options ?? {};
        const queryRegex = query instanceof RegExp ? query : new RegExp(query, 'i');
        const matchingWords = Array.from(this._words).filter((word) => !excludeSet.has(word) &&
            queryRegex.test(word) &&
            (!withCategories.length ||
                withCategories.every((c) => this._wordsCategories.get(word)?.includes(c))));
        return matchingWords;
    }
    hasWord(word) {
        return this._words.has(word);
    }
    async addWords(words, authorAuthId) {
        const data = words.map((value) => ({
            value,
            categories: (0, functions_1.determineCategories)(value)
        }));
        for (const { value, categories } of data) {
            this._words.add(value);
            if (categories.length)
                this._wordsCategories.set(value, categories);
        }
        socket_1.default.emit('wordsAdd', words, authorAuthId);
        await (0, db_1.createWords)(data);
    }
    async removeWords(words, authorAuthId) {
        for (const word of words) {
            this._words.delete(word);
            this._wordsCategories.delete(word);
        }
        socket_1.default.emit('wordsRemove', words, authorAuthId);
        await (0, db_1.deleteWords)(words);
    }
    getWordCategories(word) {
        return this._wordsCategories.get(word) ?? [];
    }
}
exports.Dictionary = Dictionary;
