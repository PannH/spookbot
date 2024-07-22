"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const constants_1 = require("../../constants");
exports.default = new classes_1.Event('chat', async (client, chatterProfile, content, customProperties) => {
    if (constants_1.COMMAND_PREFIXES.includes(content[0]))
        return void client.emit('command', content, new classes_1.Chatter(chatterProfile, client));
});
