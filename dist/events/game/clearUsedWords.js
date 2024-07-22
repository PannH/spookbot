"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('clearUsedWords', (client) => {
    if (!client.room.round)
        return;
    client.room.round.usedWords.clear();
});
