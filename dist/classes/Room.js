"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const _1 = require(".");
const constants_1 = require("../constants");
const db_1 = require("../services/db");
class Room {
    data;
    _client;
    round = null;
    seatingChatters = [];
    mode = 'normal';
    trainCategory = null;
    registerStats = true;
    notRegisterStatsReason = null;
    playstyle = 'normal';
    destroyTimeout = null;
    constructor(data, _client) {
        this.data = data;
        this._client = _client;
    }
    async destroy() {
        await (0, db_1.deleteRoomByCode)(this.data.roomEntry.roomCode);
        this.quit();
    }
    async getChatters() {
        return new Promise((resolve) => {
            this._client.roomSocket.emit('getChatterProfiles', (chatterProfiles) => resolve(chatterProfiles.map((chatterProfile) => new _1.Chatter(chatterProfile, this._client))));
        });
    }
    async getChatter(peerId) {
        return new Promise((resolve) => {
            this._client.roomSocket.emit('getChatterProfile', peerId, (chatterProfile) => chatterProfile
                ? resolve(new _1.Chatter(chatterProfile, this._client))
                : null);
        });
    }
    quit() {
        this._client.roomSocket.emit('forceQuit');
    }
    joinRound() {
        this._client.gameSocket.emit('joinRound');
    }
    leaveRound() {
        this._client.gameSocket.emit('leaveRound');
    }
    startRound() {
        this._client.gameSocket.emit('startRoundNow');
    }
    sendMessage(content, variant = 'default') {
        const variantColors = {
            default: '#ffffff',
            danger: '#e61717',
            success: '#12c934',
            warning: '#f5a905',
            info: '#197ee3'
        };
        const contentChunks = content.match(/(.|\n){1,300}/g);
        for (const chunk of contentChunks) {
            this._client.roomSocket.emit('chat', chunk, {
                color: variantColors[variant]
            });
        }
    }
    setPublic(isPublic) {
        this._client.roomSocket.emit('setRoomPublic', isPublic);
    }
    lockRules() {
        this._client.gameSocket.emit('setRulesLocked', true);
    }
    unlockRules() {
        this._client.gameSocket.emit('setRulesLocked', false);
    }
    setCustomRules(rules) {
        this.unlockRules();
        this._client.gameSocket.emit('setRules', rules);
        this.lockRules();
    }
    resetRules() {
        this.setCustomRules(constants_1.DEFAULT_RULES);
    }
    setMode(mode) {
        this.mode = mode;
        this.setCustomRules(constants_1.MODE_RULES[mode]);
    }
    setGame(gameId) {
        this._client.roomSocket.emit('setGame', gameId);
    }
}
exports.Room = Room;
