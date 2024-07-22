"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    options;
    callback;
    constructor(options, callback) {
        this.options = options;
        this.callback = callback;
    }
}
exports.Command = Command;
