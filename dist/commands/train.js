"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
const constants_1 = require("../constants");
exports.default = new classes_1.Command({
    name: 'train',
    description: 'Gérer le mode entraînement.',
    usageFormats: ['/train [catégorie]', '/train off'],
    usageExamples: ['/train eth', '/train off'],
    inSeatingOnly: true,
    roomOwnerOnly: true
}, (client, message) => {
    const targetCategory = message.args[0]?.toLowerCase();
    if (!targetCategory)
        return client.room.sendMessage('Veuillez spécifier une catégorie d\'entraînement, ou "off".', 'danger');
    if (targetCategory === 'off') {
        if (!client.room.trainCategory)
            return client.room.sendMessage('Le mode entraînement est déjà inactif.', 'danger');
        client.room.resetRules();
        client.room.trainCategory = null;
        client.room.mode = 'normal';
        client.room.registerStats = true;
        client.room.notRegisterStatsReason = null;
        client.room.sendMessage('Le mode entraînement a été désactivé, les scores seront de nouveau enregistrés.', 'success');
    }
    else {
        const CATEGORY_SHORTCUT = {
            mc: 'hyphens',
            l: 'longs',
            eth: 'ethnonyms',
            adv: 'adverbs',
            pl: 'plants',
            cr: 'creatures'
        };
        const category = CATEGORY_SHORTCUT[targetCategory];
        if (!category)
            return client.room.sendMessage(`Veuillez spécifier une catégorie parmi: ${Object.entries(CATEGORY_SHORTCUT)
                .map(([shortcut, category]) => `${shortcut} (${constants_1.TRAIN_CATEGORY_NAME_PLURAL[category]})`)
                .join(', ')}.`, 'danger');
        if (client.room.trainCategory === category)
            return client.room.sendMessage("La catégorie d'entraînement spécifiée est déjà active.", 'danger');
        client.room.setCustomRules(constants_1.TRAIN_RULES);
        client.room.trainCategory = category;
        client.room.mode = null;
        client.room.registerStats = false;
        client.room.notRegisterStatsReason = 'trainMode';
        client.room.sendMessage('Le mode entraînement est activé, les scores ne seront pas enregistrés.', 'success');
    }
});
