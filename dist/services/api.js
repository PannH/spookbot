"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = getRooms;
exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
const axios_1 = __importDefault(require("axios"));
const axios = axios_1.default.create({
    baseURL: process.env.BASE_API_URL
});
async function getRooms() {
    const response = await axios.get('/rooms');
    return response.data.publicRooms;
}
async function createRoom(data) {
    const response = await axios.post('/startRoom', data);
    return response.data.roomCode;
}
async function joinRoom(roomCode) {
    const response = await axios.post('/joinRoom', {
        roomCode
    });
    return response.data.url;
}
