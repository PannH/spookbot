"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('livesLost', async (client, playerPeerId, remainingLives) => {
    if (playerPeerId === client.room.data.selfPeerId)
        return;
    if (!remainingLives)
        return void client.emit('playerDie', client.room.round.players.get(playerPeerId));
    if (client.room.trainCategory)
        return void client.emit('trainHints', client.room.round.previousSyllable);
});
