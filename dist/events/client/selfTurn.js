"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const globals_1 = require("../../globals");
const functions_1 = require("../../functions");
const random_1 = __importDefault(require("lodash/random"));
exports.default = new classes_1.Event('selfTurn', async (client) => {
    const matchingWords = await globals_1.dictionary.searchWords(client.room.round.currentSyllable, {
        excludeSet: client.room.round.usedWords
    });
    if (!matchingWords.length)
        return client.room.round.setWord('💥');
    const noCategoryWords = matchingWords.filter((word) => !globals_1.dictionary.getWordCategories(word).length);
    const randomWord = (0, functions_1.pickRandom)(noCategoryWords.length ? noCategoryWords : matchingWords);
    if (client.room.trainCategory) {
        await (0, functions_1.sleep)(100);
        if (client.room.round.isIdle)
            await new Promise((resolve) => {
                const MAX_PROGRESS = 8;
                let i = 0;
                const progressInterval = setInterval(() => {
                    if (i === MAX_PROGRESS) {
                        clearInterval(progressInterval);
                        resolve();
                    }
                    const progressString = '◻️'.repeat(i) + '⬛'.repeat(MAX_PROGRESS - i);
                    client.room.round.setWord(progressString, false);
                    i++;
                }, 500);
            });
        client.room.round.setWord(randomWord);
        client.room.round.isIdle = false;
    }
    else {
        switch (client.room.playstyle) {
            case 'normal': {
                client.room.round.setWord(randomWord);
                break;
            }
            case 'reverse': {
                const RTL_CHARACTER = '‮';
                let currentString = '';
                for (const character of randomWord.split('')) {
                    await (0, functions_1.sleep)(25);
                    currentString += RTL_CHARACTER + character;
                    client.room.round.setWord(currentString, currentString.length === randomWord.length * 2);
                }
                break;
            }
            case 'crypted': {
                const MAX_INPUT_LENGTH = 30;
                const digitsCount = MAX_INPUT_LENGTH - randomWord.length;
                const digitsCountBetweenEachLetter = Math.floor(digitsCount / randomWord.length);
                let cryptedWord = '';
                for (const character of randomWord.split('')) {
                    let digitsString = '';
                    for (let i = 0; i < digitsCountBetweenEachLetter; i++)
                        digitsString += (0, random_1.default)(0, 9);
                    cryptedWord += digitsString + character;
                }
                for (let i = 0; i < 20; i++) {
                    await (0, functions_1.sleep)(25);
                    let digitsString = '';
                    for (let i = 0; i < cryptedWord.length; i++) {
                        digitsString += (0, random_1.default)(0, 9);
                    }
                    client.room.round.setWord(digitsString, false);
                }
                client.room.round.setWord(cryptedWord);
                break;
            }
            case 'human': {
                let inputString = '';
                for (const character of randomWord.split('')) {
                    await (0, functions_1.sleep)((0, random_1.default)(10, 200));
                    inputString += character;
                    client.room.round.setWord(inputString, false);
                }
                await (0, functions_1.sleep)((0, random_1.default)(10, 100));
                client.room.round.setWord(randomWord);
            }
        }
    }
});
