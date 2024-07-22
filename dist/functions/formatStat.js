"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStat = formatStat;
const constants_1 = require("../constants");
const globals_1 = require("../globals");
function formatStat(key, value) {
    switch (key) {
        case 'lifetime':
            return globals_1.dayjs.duration(value).format('HH:mm:ss');
        case 'alpha':
            return value
                ? `${constants_1.ALPHA_LETTERS[(value % 26) - 1].toUpperCase()} [${Math.floor(value / 26)}]`
                : '∅';
        default:
            return value.toString();
    }
}
