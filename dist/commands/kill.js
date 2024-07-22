"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
exports.default = new classes_1.Command({
    name: 'kill',
    description: 'Détruire la room actuelle.',
    usageFormats: ['/kill'],
    roomOwnerOnly: true
}, (client, message) => {
    client.room.sendMessage('Destruction de la salle...');
    client.room.destroy();
});
