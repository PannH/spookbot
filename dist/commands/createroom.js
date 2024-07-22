"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const api_1 = require("../services/api");
const db_1 = require("../services/db");
exports.default = new classes_1.Command({
    name: 'createroom',
    aliases: ['b'],
    description: 'Créer une nouvelle salle personnelle.',
    usageFormats: ['/b'],
    requireAuth: true
}, async (client, message) => {
    const currentPlayerRoom = await (0, db_1.getActiveRoomByOwnerAuthId)(message.chatter.profile.auth.id);
    if (currentPlayerRoom)
        return client.room.sendMessage(`Vous avez déjà une salle: https://jklm.fun/${currentPlayerRoom.code}`, 'danger');
    const newClient = new classes_1.Client();
    const newRoomCode = await (0, api_1.createRoom)({
        creatorUserToken: process.env.CLIENT_USER_TOKEN,
        gameId: 'bombparty',
        isPublic: true,
        name: `${message.chatter.profile.nickname} × 🎃`
    });
    await (0, db_1.createActiveRoom)({
        code: newRoomCode,
        isDefault: false,
        ownerAuthId: message.chatter.profile.auth.id
    });
    client.room.sendMessage(`${message.chatter.profile.nickname}, voici votre salle: https://jklm.fun/${newRoomCode}`);
    await newClient.joinRoom(newRoomCode);
    newClient.room.resetRules();
});
