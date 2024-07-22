"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('disconnect', async (client, reason) => {
    if (!client.room)
        return;
    console.log(`Disconnected from game socket (room: ${client.room.data.roomEntry.roomCode}): ${reason}`);
});
