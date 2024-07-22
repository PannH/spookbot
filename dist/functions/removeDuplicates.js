"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicates = removeDuplicates;
function removeDuplicates(array) {
    return [...new Set(array)];
}
