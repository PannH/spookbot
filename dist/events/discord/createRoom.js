"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const api_1 = require("../../services/api");
const db_1 = require("../../services/db");
exports.default = new classes_1.Event('createRoom', async (client, authId, nickname, callback) => {
    const newClient = new classes_1.Client();
    const newRoomCode = await (0, api_1.createRoom)({
        creatorUserToken: process.env.CLIENT_USER_TOKEN,
        gameId: 'bombparty',
        isPublic: true,
        name: `${nickname} × 🎃`
    });
    await (0, db_1.createActiveRoom)({
        code: newRoomCode,
        isDefault: false,
        ownerAuthId: authId
    });
    callback(newRoomCode);
    await newClient.joinRoom(newRoomCode);
    newClient.room.resetRules();
});
