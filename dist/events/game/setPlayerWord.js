"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('setPlayerWord', (client, playerPeerId, word) => {
    client.room.round.rawCurrentWord = word;
});
