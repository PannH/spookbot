"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const globals_1 = require("./globals");
const node_fs_1 = require("node:fs");
const httpServer = (0, node_http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    transports: ['websocket']
});
io.on('connection', (socket) => {
    console.log(`New socket connection (${socket.id})`);
    const eventFiles = (0, node_fs_1.readdirSync)(`${globals_1.baseDir}/events/discord`);
    for (const file of eventFiles) {
        const event = require(`./events/discord/${file}`).default;
        const callbackBind = event.callback.bind(null, globals_1.meta.client);
        socket.on(event.name, callbackBind);
    }
});
httpServer.listen(process.env.SERVER_PORT, () => console.log(`Socket server listening at http://localhost:${process.env.SERVER_PORT}`));
exports.default = io;
