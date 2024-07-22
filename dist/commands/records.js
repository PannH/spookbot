"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const classes_1 = require("../classes");
const constants_1 = require("../constants");
const db_1 = require("../services/db");
const functions_1 = require("../functions");
exports.default = new classes_1.Command({
    name: 'records',
    aliases: ['rec', 'r'],
    description: 'Explorer les records.',
    usageFormats: ['/r', '/r [catégorie] [-mode] [-page]'],
    usageExamples: ['/r', '/r eth', '/r t -turbo', '/r mc -sub50 -p4']
}, async (client, message) => {
    const targetCategoryShortcut = message.args[0]?.toLowerCase();
    if (targetCategoryShortcut) {
        const targetCategory = constants_1.CATEGORY_SHORTCUT_TO_CATEGORY[targetCategoryShortcut];
        const pageFlag = message.flags.find((f) => f.match(/^-p\d+$/i));
        const pageIndex = pageFlag
            ? Number.parseInt(pageFlag.match(/\d+/)[0]) - 1
            : 0;
        const targetModeFlag = message.flags
            .find((flag) => flag !== pageFlag)
            ?.toLowerCase();
        const targetMode = targetModeFlag
            ? constants_1.MODE_FLAG_TO_MODE[targetModeFlag]
            : 'normal';
        if (!targetMode)
            return client.room.sendMessage(`Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(constants_1.MODE_FLAG_TO_MODE).join(', ')}.`, 'danger');
        if (!targetCategory)
            return client.room.sendMessage(`Veuillez choisir une catégorie parmi: ${Object.entries(constants_1.CATEGORY_SHORTCUT_TO_CATEGORY)
                .map(([shortcut, category]) => `${shortcut} (${constants_1.RECORD_CATEGORY_NAME[category]})`)
                .join(', ')}.`, 'danger');
        const records = await (0, db_1.getLeadCategoryRecords)(targetCategory, targetMode, pageIndex);
        const recordsCount = await (0, db_1.getLeadCategoryRecordsCount)(targetCategory, targetMode);
        const pagesCount = Math.ceil(recordsCount / 10);
        if (!pagesCount)
            return client.room.sendMessage(`Aucun record en ${constants_1.RECORD_CATEGORY_NAME[targetCategory]} [${targetMode}].`);
        if (pageIndex >= pagesCount)
            return client.room.sendMessage(`La page ${pageIndex + 1} n'existe pas (dernière page: ${pagesCount}).`, 'danger');
        client.room.sendMessage(`Records en ${constants_1.RECORD_CATEGORY_NAME[targetCategory]} [${targetMode}] (${pageIndex + 1} / ${pagesCount}): \n${records.map((r, i) => `${(0, functions_1.getPositionString)(i + 10 * pageIndex)} ${(0, functions_1.formatStat)(r.key, r.value)} (${r.Profile.nickname})`).join('\n')}`);
    }
    else {
        const targetMode = message.flags.length
            ? constants_1.MODE_FLAG_TO_MODE[message.flags[0].toLowerCase()]
            : 'normal';
        if (!targetMode)
            return client.room.sendMessage(`Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(constants_1.MODE_FLAG_TO_MODE).join(', ')}.`, 'danger');
        const records = await (0, db_1.getLeadRecords)(targetMode);
        const categories = Object.keys(constants_1.RECORD_CATEGORY_NAME);
        client.room.sendMessage(`Records globaux [${targetMode}]:\n${categories
            .map((cat) => {
            const record = records.find((r) => r?.key === cat);
            return `${(0, capitalize_1.default)(constants_1.RECORD_CATEGORY_NAME[cat])}: ${record ? `${(0, functions_1.formatStat)(record.key, record.value)} (${record.Profile.nickname})` : 'N/A'}`;
        })
            .join('\n')}`);
    }
});
