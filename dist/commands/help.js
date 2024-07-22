"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const functions_1 = require("../functions");
const globals_1 = require("../globals");
exports.default = new classes_1.Command({
    name: 'help',
    description: "Obtenir la liste des commandes ou de l'aide pour l'une d'elles.",
    usageFormats: ['/help', '/help [commande]'],
    usageExamples: ['/help', '/help records']
}, (client, message) => {
    const commandNameQuery = message.args[0]?.toLowerCase();
    if (!commandNameQuery) {
        client.room.sendMessage(`Commandes: ${globals_1.commands.map((c) => `/${c.options.name}`).join(' — ')}`);
    }
    else {
        const command = globals_1.commands.find((c) => c.options.name === commandNameQuery ||
            c.options.aliases?.includes(commandNameQuery));
        if (!command)
            return client.room.sendMessage(`La commande /${commandNameQuery} n'existe pas.`, 'danger');
        const { options } = command;
        client.room.sendMessage(`Commande /${options.name}${options.aliases?.length ? ` (${options.aliases.map((a) => `/${a}`).join(', ')})` : ''}: ${options.description}\n\n${(0, functions_1.pluralize)(options.usageFormats.length, 'Format')} :\n${options.usageFormats.join('\n')}${options.usageExamples?.length ? `\n\n${(0, functions_1.pluralize)(options.usageExamples.length, 'Exemple')} :\n${options.usageExamples.join('\n')}` : ''}`);
    }
});
