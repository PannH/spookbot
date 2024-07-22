"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Round = void 0;
class Round {
    _milestone;
    _client;
    isOver = false;
    startTime = Date.now();
    usedWords = new Set();
    previousSyllable;
    currentSyllable;
    players = new Map();
    rawCurrentWord = '';
    isIdle = false;
    currentBonusWord = null;
    constructor(_milestone, _client) {
        this._milestone = _milestone;
        this._client = _client;
        this.previousSyllable = _milestone.syllable;
        this.currentSyllable = _milestone.syllable;
    }
    get currentWord() {
        return this.rawCurrentWord.replace(/[^a-z'-]/g, '');
    }
    setWord(word, submit = true) {
        this._client.gameSocket.emit('setWord', word, submit);
    }
}
exports.Round = Round;
