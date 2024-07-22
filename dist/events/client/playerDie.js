"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const constants_1 = require("../../constants");
const functions_1 = require("../../functions");
const db_1 = require("../../services/db");
const globals_1 = require("../../globals");
const socket_1 = __importDefault(require("../../socket"));
exports.default = new classes_1.Event('playerDie', async (client, player) => {
    player.setStat('lifetime', Date.now() - client.room.round.startTime);
    const stats = Object.entries(player.stats).reduce((acc, [k, v]) => {
        if (v)
            acc[k] = v;
        return acc;
    }, {});
    if (!Object.values(stats).length)
        return;
    const earnedCoins = Math.floor(Object.entries(stats).reduce((acc, [k, v]) => {
        acc += constants_1.STAT_COINS_WORTH[k] * v;
        return acc;
    }, 0));
    client.room.sendMessage(`Bien joué ${player.profile.nickname} ! Voici vos scores: ${Object.entries(stats)
        .map(([k, v]) => `${constants_1.STAT_NAME[k]} (${(0, functions_1.formatStat)(k, v)})`)
        .join(' — ')}${player.profile.auth && earnedCoins ? ` ⇒ +${earnedCoins} 🪙` : ''}`);
    if (client.room.trainCategory)
        return client.room.sendMessage(`🏋️ ${player.profile.nickname}, vous avez placé ${stats[client.room.trainCategory]} / ${stats.words} ${(0, functions_1.pluralize)(stats[client.room.trainCategory], constants_1.TRAIN_CATEGORY_NAME_SINGULAR[client.room.trainCategory], constants_1.TRAIN_CATEGORY_NAME_PLURAL[client.room.trainCategory])} (${(0, functions_1.percentage)(stats[client.room.trainCategory], stats.words).toFixed(1)}%).`);
    if (!client.room.registerStats)
        return client.room.sendMessage(`Rappel: les scores ne sont pas enregistrés car ${constants_1.NOT_REGISTER_STATS_REASON[client.room.notRegisterStatsReason]}.`, 'warning');
    if (!player.profile.auth)
        return client.room.sendMessage('Connectez-vous avec Discord, Twitch, ou JKLM pour sauvegarder vos scores.', 'info');
    const profile = (await (0, db_1.getProfileByAuthId)(player.profile.auth.id)) ??
        (await (0, db_1.createProfile)({
            authId: player.profile.auth.id,
            nickname: player.profile.nickname
        }));
    const oldRecords = await (0, db_1.getRecordsByProfileId)(profile.id, client.room.mode);
    const oldLeadRecords = (await (0, db_1.getLeadRecords)(client.room.mode)).filter(Boolean);
    const newRecords = (await Promise.all(Object.entries(stats).map(([k, v]) => {
        const oldRecord = oldRecords.find((r) => r.key === k);
        if (!oldRecord || oldRecord.value < v)
            return globals_1.prisma.record.upsert({
                where: {
                    id: oldRecord?.id ?? -1
                },
                update: {
                    value: v
                },
                create: {
                    key: k,
                    value: v,
                    mode: client.room.mode,
                    profileId: profile.id
                }
            });
    }))).filter(Boolean);
    if (newRecords.length) {
        client.room.sendMessage(`🎉 Vous avez battu ${(0, functions_1.pluralize)(newRecords.length, 'un', 'certains')} de vos records [${client.room.mode}]: ${newRecords
            .map((r) => {
            const oldRecord = oldRecords.find((or) => or.key === r.key);
            return `${constants_1.STAT_NAME[r.key]} (${(0, functions_1.formatStat)(r.key, oldRecord?.value ?? constants_1.DEFAULT_ROUND_PLAYER_STATS[r.key])} → ${(0, functions_1.formatStat)(r.key, r.value)})`;
        })
            .join(' — ')}`);
        const newLeadRecords = newRecords.filter((r) => {
            const leadRecord = oldLeadRecords.find((lr) => lr.key === r.key);
            return !leadRecord || leadRecord.value < r.value;
        });
        if (newLeadRecords.length) {
            const recordUpdates = newLeadRecords.map((r) => {
                const oldRecord = oldLeadRecords.find((or) => or.key === r.key);
                const update = {
                    key: r.key,
                    mode: r.mode,
                    newRecord: {
                        nickname: profile.nickname,
                        value: r.value
                    }
                };
                if (oldRecord)
                    update.oldRecord = {
                        nickname: oldRecord.Profile.nickname,
                        value: oldRecord.value
                    };
                return update;
            });
            client.room.sendMessage(`🏆 Vous avez battu ${(0, functions_1.pluralize)(newLeadRecords.length, 'un record global', 'certains records globaux')} [${client.room.mode}]: ${recordUpdates
                .map((u) => `${constants_1.STAT_NAME[u.key]} (${u.oldRecord ? `${(0, functions_1.formatStat)(u.key, u.oldRecord.value)} [${u.oldRecord.nickname}] → ` : ''}${(0, functions_1.formatStat)(u.key, u.newRecord.value)})`)
                .join(' — ')}`);
            socket_1.default.emit('newLeadRecords', recordUpdates);
        }
    }
    await globals_1.prisma.profile.update({
        where: {
            id: profile.id
        },
        data: {
            coins: {
                increment: earnedCoins + player.taughtWordsCount * 3
            },
            taughtWords: {
                increment: player.taughtWordsCount
            },
            playtime: {
                increment: player.stats.lifetime
            }
        }
    });
});
