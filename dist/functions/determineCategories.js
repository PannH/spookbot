"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineCategories = determineCategories;
function determineCategories(word) {
    const categories = [];
    if (word.length >= 20)
        categories.push('long');
    if (word.includes('-'))
        categories.push('hyphen');
    return categories;
}
