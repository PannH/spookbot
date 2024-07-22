"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const db_1 = require("../../services/db");
exports.default = new classes_1.Event('setPlayerCount', async (client, playerCount) => {
    if (playerCount <= 1) {
        const defaultRoom = await (0, db_1.getDefaultActiveRoom)();
        if (defaultRoom.code === client.room.data.roomEntry.roomCode)
            return;
        client.room.destroyTimeout = setTimeout(() => {
            console.log(`Destroying room ${client.room.data.roomEntry.roomCode} after 10 minutes of inactivity`);
            client.room.destroy();
            client.room = null;
        }, 10 * 60 * 1000);
    }
    else if (playerCount > 1 && client.room.destroyTimeout) {
        clearTimeout(client.room.destroyTimeout);
        client.room.destroyTimeout = null;
    }
});
