"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
exports.default = new classes_1.Command({
    name: 'playstyle',
    aliases: ['ps'],
    description: 'Modifier le style de jeu du bot.',
    usageFormats: ['/playstyle [style]'],
    usageExamples: ['/playstyle normal', '/playstyle reverse'],
    roomOwnerOnly: true
}, (client, message) => {
    const playstyleQuery = message.args[0]?.toLowerCase();
    const PLAYSTYLES = ['normal', 'human', 'reverse', 'crypted'];
    if (!playstyleQuery || !PLAYSTYLES.includes(playstyleQuery))
        return client.room.sendMessage(`Veuillez spécifier un style de jeu parmi: ${PLAYSTYLES.join(', ')}.`, 'danger');
    if (client.room.playstyle === playstyleQuery)
        return client.room.sendMessage(`Le style de jeu est déjà défini sur "${playstyleQuery}".`, 'danger');
    client.room.playstyle = playstyleQuery;
    client.room.sendMessage(`Style de jeu appliqué: ${client.room.playstyle}.`, 'success');
});
