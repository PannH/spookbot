"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSyllables = getSyllables;
function getSyllables(word) {
    const syllablesSet = new Set();
    for (let i = 0; i < word.length - 1; i++) {
        for (let j = i + 2; j <= i + 3 && j <= word.length; j++) {
            const syllable = word.slice(i, j);
            if (['-', "'"].some((char) => syllable.includes(char)))
                continue;
            syllablesSet.add(syllable);
        }
    }
    return Array.from(syllablesSet);
}
