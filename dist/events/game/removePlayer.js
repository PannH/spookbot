"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('removePlayer', async (client, playerPeerId) => {
    client.room.seatingChatters = client.room.seatingChatters.filter((chatter) => chatter.profile.peerId !== playerPeerId);
});
