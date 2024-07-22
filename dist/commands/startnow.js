"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
exports.default = new classes_1.Command({
    name: 'startnow',
    description: 'Démarrer la partie directement.',
    aliases: ['sn'],
    usageFormats: ['/startnow'],
    roomOwnerOnly: true,
    inSeatingOnly: true
}, (client, message) => {
    if (client.room.seatingChatters.length < 2)
        return client.room.sendMessage('Il faut au moins 2 joueurs pour démarrer la partie.', 'danger');
    client.room.startRound();
    client.room.sendMessage('Lancement de la partie.', 'success');
});
