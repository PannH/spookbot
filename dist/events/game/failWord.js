"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const constants_1 = require("../../constants");
const globals_1 = require("../../globals");
exports.default = new classes_1.Event('failWord', async (client, playerPeerId, reason) => {
    const { currentWord: word } = client.room.round;
    if (playerPeerId === client.room.data.selfPeerId &&
        reason === 'notInDictionary') {
        client.emit('selfTurn');
        if (globals_1.dictionary.hasWord(word)) {
            globals_1.dictionary.removeWords([word]);
            client.room.sendMessage(`Le mot ${word.toUpperCase()} n'a pas fonctionné et a été enlevé du dictionnaire.`, 'danger');
        }
    }
    if (playerPeerId !== client.room.data.selfPeerId &&
        constants_1.COMMAND_PREFIXES.includes(client.room.round.rawCurrentWord[0])) {
        const chatter = await client.room.getChatter(playerPeerId);
        return void client.emit('command', client.room.round.rawCurrentWord, chatter);
    }
});
