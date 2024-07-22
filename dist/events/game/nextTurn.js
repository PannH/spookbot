"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('nextTurn', (client, peerId, syllable) => {
    client.room.round.previousSyllable = client.room.round.currentSyllable;
    client.room.round.currentSyllable = syllable;
    if (peerId === client.room.data.selfPeerId)
        client.emit('selfTurn');
});
