"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const api_1 = require("../services/api");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_stream_1 = require("node:stream");
const _1 = require(".");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
class Client extends node_stream_1.EventEmitter {
    nickname;
    picture;
    gameSocket = null;
    roomSocket = null;
    room = null;
    constructor(nickname = process.env.DEFAULT_CLIENT_NICKNAME, picture = process.env.DEFAULT_CLIENT_PICTURE) {
        super();
        this.nickname = nickname;
        this.picture = picture;
    }
    _initEvents() {
        const eventsPath = __dirname.replace('classes', 'events');
        for (const subDir of (0, node_fs_1.readdirSync)(eventsPath)) {
            for (const file of (0, node_fs_1.readdirSync)(`${eventsPath}/${subDir}`)) {
                const event = require((0, node_path_1.relative)(__dirname, `${eventsPath}/${subDir}/${file}`)).default;
                const callbackBind = event.callback.bind(null, this);
                switch (subDir) {
                    case 'game':
                        this.gameSocket.on(event.name, callbackBind);
                        break;
                    case 'room':
                        this.roomSocket.on(event.name, callbackBind);
                        break;
                    case 'client':
                        this.on(event.name, callbackBind);
                        break;
                }
            }
        }
    }
    async joinRoom(roomCode, fromDisconnect = false) {
        return new Promise((resolve) => {
            (async () => {
                const nodeUrl = await (0, api_1.joinRoom)(roomCode);
                const SOCKET_OPTIONS = {
                    transports: ['websocket'],
                    reconnection: true
                };
                this.gameSocket = (0, socket_io_client_1.default)(nodeUrl, SOCKET_OPTIONS);
                this.roomSocket = (0, socket_io_client_1.default)(nodeUrl, SOCKET_OPTIONS);
                this.roomSocket.once('connect', () => {
                    this.roomSocket.emit('joinRoom', {
                        auth: {
                            service: 'jklm',
                            token: process.env.CLIENT_TOKEN,
                            username: 'SpookBot'
                        },
                        nickname: this.nickname,
                        picture: this.picture,
                        userToken: process.env.CLIENT_USER_TOKEN,
                        roomCode
                    }, async (room) => {
                        this.gameSocket.emit('joinGame', room.roomEntry.gameId, roomCode, process.env.CLIENT_USER_TOKEN);
                        if (!fromDisconnect)
                            this.room = new _1.Room(room, this);
                        this._initEvents();
                        resolve();
                    });
                });
            })();
        });
    }
}
exports.Client = Client;
