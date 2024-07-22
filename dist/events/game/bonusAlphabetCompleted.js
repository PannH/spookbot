"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('bonusAlphabetCompleted', async (client, playerPeerId) => {
    if (playerPeerId === client.room.data.selfPeerId)
        return;
    const player = client.room.round.players.get(playerPeerId);
    player.incrementStat('lives');
    client.room.sendMessage(`${player.profile.nickname} a gagné une vie (${player.stats.lives}).`);
});
