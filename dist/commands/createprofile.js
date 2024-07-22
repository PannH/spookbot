"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const db_1 = require("../services/db");
exports.default = new classes_1.Command({
    name: 'createprofile',
    aliases: ['cp'],
    description: 'Créer son profil.',
    usageFormats: ['/createprofile'],
    requireAuth: true
}, async (client, message) => {
    const profile = (0, db_1.getProfileByAuthId)(message.chatter.profile.auth.id);
    if (profile)
        return client.room.sendMessage('Vous avez déjà un profil.', 'danger');
    await (0, db_1.createProfile)({
        authId: message.chatter.profile.auth.id,
        nickname: message.chatter.profile.nickname
    });
    client.room.sendMessage('Profil créé avec succès, utilisez "/profile" pour le voir.', 'success');
});
