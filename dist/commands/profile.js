"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const constants_1 = require("../constants");
const functions_1 = require("../functions");
const db_1 = require("../services/db");
const globals_1 = require("../globals");
exports.default = new classes_1.Command({
    name: 'profile',
    aliases: ['p'],
    description: "Afficher votre profil ou celui d'un autre joueur.",
    usageFormats: ['/profile', '/profile [pseudo]'],
    usageExamples: ['/profile', '/profile Joueur123']
}, async (client, message) => {
    const targetNickname = message.args.join(' ');
    if (message.flags.length > 1)
        return client.room.sendMessage("Veuillez ne spécifier qu'un seul mode de jeu.", 'danger');
    if (targetNickname === '' && !message.chatter.profile.auth)
        return client.room.sendMessage("Vous n'avez pas de profil, connectez-vous avec Discord, Twitch, ou JKLM pour en créer un.", 'danger');
    const targetMode = message.flags.length
        ? constants_1.MODE_FLAG_TO_MODE[message.flags[0]]
        : 'normal';
    if (!targetMode)
        return client.room.sendMessage(`Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(constants_1.MODE_FLAG_TO_MODE).join(', ')}.`, 'danger');
    const profile = targetNickname === ''
        ? await (0, db_1.getProfileByAuthIdWithRecords)(message.chatter.profile.auth.id, targetMode)
        : await (0, db_1.getProfileByNicknameWithRecords)(targetNickname, targetMode);
    if (!profile && targetNickname === '')
        return client.room.sendMessage('Vous n\'avez pas encore de profil, utilisez "/createprofile" pour le créer ou jouer une partie.', 'danger');
    if (!profile)
        return client.room.sendMessage(`Le profil "${targetNickname}" n'existe pas.`, 'danger');
    client.room.sendMessage(`Profil de ${profile.nickname}:\n\nRecords [${targetMode}]: ${profile.records.length ? profile.records.map((r) => `${constants_1.STAT_NAME[r.key]} (${(0, functions_1.formatStat)(r.key, r.value)})`).join(' — ') : 'Aucun'}\n\nPièces: ${profile.coins} 🪙\nMots appris: ${profile.taughtWords}\nTemps de jeu: ${globals_1.dayjs.duration(profile.playtime).format('HH[h] mm[m] ss[s]')}${profile.roles.length ? `\n\nRôles staff: ${profile.roles.map((r) => constants_1.PROFILE_ROLE_NAME[r]).join(', ')}` : ''}`);
});
