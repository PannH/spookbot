"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('addPlayer', async (client, player) => {
    client.room.seatingChatters.push(new classes_1.Chatter(player.profile, client));
});
