"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactNumber = compactNumber;
function compactNumber(num) {
    return Intl.NumberFormat('fr-FR', {
        notation: 'compact'
    }).format(num);
}
