"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    content;
    chatter;
    _client;
    rawArgs;
    flags;
    args;
    constructor(content, chatter, _client) {
        this.content = content;
        this.chatter = chatter;
        this._client = _client;
        this.rawArgs = this.content.split(/ +/gm).filter((arg) => arg !== '');
        this.flags = this.rawArgs.filter((arg) => /^-.+/.test(arg));
        this.args = this.rawArgs.filter((arg) => !this.flags.includes(arg));
    }
}
exports.Message = Message;
