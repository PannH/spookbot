"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundPlayer = void 0;
const _1 = require(".");
const constants_1 = require("../constants");
class RoundPlayer extends _1.Chatter {
    stats = structuredClone(constants_1.DEFAULT_ROUND_PLAYER_STATS);
    taughtWordsCount = 0;
    constructor(profile, client) {
        super(profile, client);
    }
    setStat(key, value) {
        this.stats[key] = value;
    }
    incrementStat(key, increment = 1) {
        this.stats[key] += increment;
    }
}
exports.RoundPlayer = RoundPlayer;
