"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    name;
    callback;
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
}
exports.Event = Event;
