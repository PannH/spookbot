"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const constants_1 = require("../../constants");
const functions_1 = require("../../functions");
const globals_1 = require("../../globals");
const db_1 = require("../../services/db");
const shuffle_1 = __importDefault(require("lodash/shuffle"));
exports.default = new classes_1.Event('correctWord', async (client, { playerPeerId }) => {
    if (!client.room.round)
        return;
    const word = client.room.round.currentWord;
    client.room.round.usedWords.add(word);
    if (playerPeerId === client.room.data.selfPeerId)
        return;
    const player = client.room.round.players.get(playerPeerId);
    if (!globals_1.dictionary.hasWord(word)) {
        globals_1.dictionary.addWords([word], player.profile.auth?.id);
        client.room.sendMessage(`Merci ${player.profile.nickname} ! Vous avez appris le mot ${word.toUpperCase()} au bot${player.profile.auth ? ' (+3 🪙)' : ''}.`, 'info');
        player.taughtWordsCount++;
    }
    player.incrementStat('words');
    const wordCategories = await (0, db_1.getWordCategories)(word);
    for (const category of wordCategories)
        player.incrementStat(constants_1.CATEGORY_TO_STAT[category]);
    const currentAlphaIndex = player.stats.alpha % 26;
    const wordAlphaIndex = word.charCodeAt(0) - 97;
    if (currentAlphaIndex === wordAlphaIndex) {
        player.incrementStat('alpha');
        wordCategories.push('alpha');
    }
    if (client.room.round.currentBonusWord === word) {
        player.incrementStat('bonusWords');
        wordCategories.push('bonus');
        const possibleBonusWords = (0, shuffle_1.default)(await globals_1.prisma.word.findMany({
            where: {
                categories: {
                    equals: []
                },
                value: {
                    notIn: Array.from(client.room.round.usedWords)
                }
            },
            select: {
                value: true
            }
        }));
        const bonusWord = possibleBonusWords[0].value;
        client.room.round.currentBonusWord = bonusWord;
        client.room.sendMessage(`Le nouveau mot bonus est: ${bonusWord.toUpperCase()}`);
    }
    if (client.room.trainCategory) {
        if (wordCategories.includes(constants_1.TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]))
            client.room.sendMessage(`✅ ${player.profile.nickname} a placé ${constants_1.CATEGORY_NAME_WITH_ARTICLE[constants_1.TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]]} (${player.stats[client.room.trainCategory]}, ${(0, functions_1.percentage)(player.stats[client.room.trainCategory], player.stats.words).toFixed(1)}%): ${word.toUpperCase()}`);
        else
            client.emit('trainHints', client.room.round.previousSyllable);
    }
    if (wordCategories.length && !client.room.trainCategory)
        client.room.sendMessage(`${player.profile.nickname} a placé ${wordCategories.map((category) => `${constants_1.CATEGORY_NAME_WITH_ARTICLE[category]} (${(0, functions_1.formatStat)(constants_1.CATEGORY_TO_STAT[category], player.stats[constants_1.CATEGORY_TO_STAT[category]])})`).join(', ')}: ${word.toUpperCase()}`);
    const wordSyllables = (0, functions_1.getSyllables)(word);
    const wordsPerSyllable = await Promise.all(wordSyllables.map(async (syl) => (await globals_1.dictionary.searchWords(syl, {
        excludeSet: client.room.round.usedWords
    })).length));
    const fuckedSyllables = wordSyllables.filter((syl, i) => !wordsPerSyllable[i]);
    if (fuckedSyllables.length) {
        player.incrementStat('fuckedSyllables', fuckedSyllables.length);
        if (!client.room.trainCategory)
            client.room.sendMessage(`${player.profile.nickname} a niqué ${(0, functions_1.pluralize)(fuckedSyllables.length, 'la syllabe', 'les syllabes')} ${fuckedSyllables.map((syl) => syl.toUpperCase()).join(', ')} (${player.stats.fuckedSyllables}): ${word.toUpperCase()}`);
    }
});
