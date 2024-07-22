"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluralize = pluralize;
function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural ?? `${singular}s`;
}
