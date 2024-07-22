"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatter = void 0;
class Chatter {
    profile;
    _client;
    constructor(profile, _client) {
        this.profile = profile;
        this._client = _client;
    }
    async setModerator(isModerator) {
        return new Promise((resolve, reject) => {
            this._client.roomSocket.emit('setUserModerator', this.profile.peerId, isModerator, (response) => {
                if ('errorCode' in response)
                    return reject(response.errorCode);
                this.profile.roles = response.roles;
                resolve();
            });
        });
    }
    ban() {
        this._client.roomSocket.emit('setUserBanned', this.profile.peerId, true);
    }
    unban() {
        this._client.roomSocket.emit('setUserBanned', this.profile.peerId, false);
    }
    softBan() {
        this.ban();
        this.unban();
    }
}
exports.Chatter = Chatter;
