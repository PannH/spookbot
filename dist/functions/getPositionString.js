"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPositionString = getPositionString;
function getPositionString(index) {
    switch (index) {
        case 0:
            return '🥇';
        case 1:
            return '🥈';
        case 2:
            return '🥉';
        default:
            return `${index + 1}.`;
    }
}
