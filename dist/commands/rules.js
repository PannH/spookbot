"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
exports.default = new classes_1.Command({
    name: 'rules',
    description: 'Changer les règles.',
    usageFormats: [
        '/rules reset',
        '/rules [difficulty_syllabes] [durée_tour] [âge_syllabes] [vies_départ] [vies_max]'
    ],
    usageExamples: ['/rules reset', '/rules 500 5 16 2 3'],
    inSeatingOnly: true,
    roomOwnerOnly: true
}, (client, message) => {
    const ruleOptions = message.rawArgs;
    if (ruleOptions.length !== 5 && ruleOptions.length !== 1)
        return client.room.sendMessage('Veuillez spécifier les 5 paramètres nécessaires, ou "reset".', 'danger');
    if (ruleOptions.length === 1) {
        if (ruleOptions[0].toLowerCase() !== 'reset')
            return client.room.sendMessage('Veuillez spécifier les 5 paramètres nécessaires, ou "reset".', 'danger');
        client.room.resetRules();
        client.room.registerStats = true;
        client.room.notRegisterStatsReason = null;
        client.room.mode = 'normal';
        client.room.trainCategory = null;
        client.room.sendMessage('Les règles ont été réinitialisées, les scores seront de nouveau enregistrés.', 'success');
    }
    else {
        const ruleValues = ruleOptions.map((opt) => Number.parseInt(opt));
        if (ruleValues.some((v) => Number.isNaN(v)))
            return client.room.sendMessage('Veuillez spécifier des nombres valides.', 'danger');
        const rules = {
            customPromptDifficulty: ruleValues[0],
            minTurnDuration: ruleValues[1],
            maxPromptAge: ruleValues[2],
            startingLives: ruleValues[3],
            maxLives: ruleValues[4]
        };
        if (rules.customPromptDifficulty < -5000 ||
            rules.customPromptDifficulty > 5000)
            return client.room.sendMessage('La difficulté des syllabes doit être comprise entre -5000 et 5000.', 'danger');
        if (rules.minTurnDuration < 1 || rules.minTurnDuration > 10)
            return client.room.sendMessage('La durée minimum des tours doit être comprise entre 1 et 10.', 'danger');
        if (rules.maxPromptAge < 1 || rules.maxPromptAge > 16)
            return client.room.sendMessage("L'âge maximum des syllabes doit être compris entre 1 et 16.", 'danger');
        if (rules.startingLives < 1 || rules.startingLives > 5)
            return client.room.sendMessage('Le nombre de vies de départ doit être compris entre 1 et 5.', 'danger');
        if (rules.maxLives < 1 || rules.maxLives > 10)
            return client.room.sendMessage('Le nombre maximum de vies doit être compris entre 1 et 10.', 'danger');
        client.room.setCustomRules(rules);
        client.room.registerStats = false;
        client.room.notRegisterStatsReason = 'customRules';
        client.room.mode = null;
        client.room.trainCategory = null;
        client.room.sendMessage('Les règles ont été modifiées, les scores ne seront pas enregistrés.', 'success');
    }
});
