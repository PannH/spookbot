"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const globals_1 = require("../../globals");
const shuffle_1 = __importDefault(require("lodash/shuffle"));
exports.default = new classes_1.Event('setMilestone', async (client, milestone) => {
    switch (milestone.name) {
        case 'round': {
            client.room.round = new classes_1.Round(milestone, client);
            for (const chatter of client.room.seatingChatters)
                client.room.round.players.set(chatter.profile.peerId, new classes_1.RoundPlayer(chatter.profile, client));
            client.room.seatingChatters = [];
            if (milestone.currentPlayerPeerId === client.room.data.selfPeerId)
                client.emit('selfTurn');
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
            client.room.sendMessage(`Le mot bonus est: ${bonusWord.toUpperCase()}`);
            break;
        }
        case 'seating': {
            if (client.room.round)
                client.room.round.isOver = true;
            client.room.joinRound();
            break;
        }
    }
});
