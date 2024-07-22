"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const db_1 = require("../../services/db");
exports.default = new classes_1.Event('chatterAdded', async (client, chatterProfile) => {
    client.room.sendMessage(`Bienvenue ${chatterProfile.nickname} ! Vous pouvez utiliser /help pour voir les commandes et rejoindre le Discord: https://dsc.gg/spookbot\nPS: Le bot est en bêta et est propice à certains bugs.`);
    const profile = await (0, db_1.getProfileByAuthId)(chatterProfile.auth?.id);
    const activeRoom = await (0, db_1.getActiveRoomByCode)(client.room.data.roomEntry.roomCode);
    if (profile?.roles?.length ||
        (chatterProfile.auth &&
            chatterProfile.auth.id === activeRoom.ownerAuthId)) {
        const chatter = await client.room.getChatter(chatterProfile.peerId);
        chatter.setModerator(true).catch(() => { });
    }
});
