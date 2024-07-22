"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = pickRandom;
const random_1 = __importDefault(require("lodash/random"));
function pickRandom(array) {
    return array[(0, random_1.default)(0, array.length - 1)];
}
