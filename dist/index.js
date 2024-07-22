"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./socket");
const globals_1 = require("./globals");
const classes_1 = require("./classes");
const db_1 = require("./services/db");
const api_1 = require("./services/api");
const node_fs_1 = require("node:fs");
const prisma_backup_1 = require("@vorlefan/prisma-backup");
const cron_1 = require("cron");
process.on('uncaughtException', (error, origin) => {
    console.error(`Uncaught exception: ${error}`);
});
(async () => {
    await globals_1.dictionary.initCache();
    let activeRooms = await (0, db_1.getActiveRooms)();
    const jklmRooms = await (0, api_1.getRooms)();
    const expiredRooms = activeRooms.filter((activeRoom) => !jklmRooms.some((room) => room.roomCode === activeRoom.code));
    await (0, db_1.deleteRoomsByCode)(expiredRooms.map(({ code }) => code));
    activeRooms = activeRooms.filter((activeRoom) => jklmRooms.some((room) => room.roomCode === activeRoom.code));
    for (const activeRoom of activeRooms) {
        if (!jklmRooms.some((room) => room.roomCode === activeRoom.code))
            continue;
        const client = new classes_1.Client();
        await client.joinRoom(activeRoom.code);
        console.log(`Joined room: ${activeRoom.code}`);
    }
    if (!activeRooms.some((activeRoom) => activeRoom.isDefault)) {
        const client = new classes_1.Client();
        const roomCode = await (0, api_1.createRoom)({
            creatorUserToken: process.env.CLIENT_USER_TOKEN,
            gameId: 'bombparty',
            isPublic: false,
            name: '🎃 SpookBot [BETA][FR]'
        });
        await (0, db_1.createActiveRoom)({
            code: roomCode,
            isDefault: true,
            ownerAuthId: null
        });
        await client.joinRoom(roomCode);
        console.log(`Joined default room: ${roomCode}`);
        client.room.resetRules();
    }
})();
new cron_1.CronJob('0 0 0 * * *', async () => {
    console.log('Running database backup...');
    const [profiles, records, words] = await globals_1.prisma.$transaction([
        globals_1.prisma.profile.findMany(),
        globals_1.prisma.record.findMany(),
        globals_1.prisma.word.findMany()
    ]);
    await (0, prisma_backup_1.runBackup)({
        models: {
            profiles,
            records,
            words
        },
        compress: true,
        folder: 'backups/'
    });
    (0, node_fs_1.rmSync)('backups/', {
        recursive: true,
        force: true
    });
    console.log('Database backup complete');
}, null, true, 'Europe/Brussels');
