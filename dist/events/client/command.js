"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("../../globals");
const db_1 = require("../../services/db");
const classes_1 = require("../../classes");
exports.default = new classes_1.Event('command', async (client, content, chatter) => {
    const commandName = content.slice(1).split(/ +/gm).shift().toLowerCase();
    const command = globals_1.commands.find(({ options }) => options.name === commandName ||
        options?.aliases?.includes(commandName));
    if (!command)
        return;
    const profile = await (0, db_1.getProfileByAuthId)(chatter.profile.auth?.id);
    if (!profile?.roles?.includes('admin')) {
        if (command.options.adminOnly && !profile?.roles?.includes('admin'))
            return client.room.sendMessage('Cette commande est réservée aux administrateurs du bot.', 'danger');
        if (command.options.trustedOnly &&
            !profile?.roles?.includes('trusted'))
            return client.room.sendMessage('Cette commande est réservée aux trusteds du bot.', 'danger');
        if (command.options.dictionaryManagerOnly &&
            !profile?.roles?.includes('dictionaryManager'))
            return client.room.sendMessage('Cette commande est réservée aux gérants dico du bot.', 'danger');
        if (command.options.requireAuth && !chatter.profile.auth)
            return client.room.sendMessage('Vous devez être connecté à Discord, Twitch, ou JKLM pour utiliser cette commande.', 'danger');
        if (command.options.roomOwnerOnly) {
            const activeRoom = await (0, db_1.getActiveRoomByCode)(client.room.data.roomEntry.roomCode);
            if (activeRoom.ownerAuthId !== chatter.profile.auth?.id)
                return client.room.sendMessage('Vous devez être le propriétaire de la salle pour utiliser cette commande.', 'danger');
        }
    }
    if (command.options.inSeatingOnly &&
        client.room.round &&
        !client.room.round.isOver)
        return client.room.sendMessage("Cette commande n'est pas utilisable pendant une partie.", 'danger');
    const message = new classes_1.Message(content.slice(commandName.length + 1).trim(), chatter, client);
    command.callback(client, message);
});
