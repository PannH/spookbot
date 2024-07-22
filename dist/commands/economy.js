"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const functions_1 = require("../functions");
const db_1 = require("../services/db");
exports.default = new classes_1.Command({
    name: 'economy',
    aliases: ['eco'],
    description: 'Explorer le classement économique.',
    usageFormats: ['/eco [-page]'],
    usageExamples: ['/eco', '/eco -p3']
}, async (client, message) => {
    const pageFlag = message.flags.find((f) => f.match(/^-p\d+$/i));
    const pageIndex = pageFlag
        ? Number.parseInt(pageFlag.match(/\d+/)[0]) - 1
        : 0;
    const profiles = await (0, db_1.getEconomyProfiles)(pageIndex);
    const profilesCount = await (0, db_1.getProfilesCount)();
    const pagesCount = Math.ceil(profilesCount / 10);
    if (!pagesCount)
        return client.room.sendMessage('Aucun profil à afficher.');
    if (pageIndex >= pagesCount)
        return client.room.sendMessage(`La page ${pageIndex + 1} n'existe pas (dernière page: ${pagesCount}).`, 'danger');
    client.room.sendMessage(`Classement économique (${pageIndex + 1} / ${pagesCount}) :\n${profiles.map((p, i) => `${(0, functions_1.getPositionString)(i + 10 * pageIndex)} ${p.coins} 🪙 (${p.nickname})`).join('\n')}`);
});
