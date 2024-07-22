"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.prisma = exports.dayjs = exports.dictionary = exports.baseDir = exports.commands = void 0;
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const client_1 = require("@prisma/client");
const node_child_process_1 = require("node:child_process");
const classes_1 = require("./classes");
try {
    const { PrismaClient } = require('@prisma/client');
    new PrismaClient();
}
catch (error) {
    console.log('Generating Prisma client...');
    (0, node_child_process_1.execSync)('npm run prisma:generate');
}
console.log('Deploying Prisma migrations...');
(0, node_child_process_1.execSync)('npm run prisma:deploy');
const commands = [];
exports.commands = commands;
const commandsPath = `${__dirname}/commands`;
for (const file of (0, node_fs_1.readdirSync)(commandsPath)) {
    const command = require(`./${(0, node_path_1.relative)(__dirname, `${commandsPath}/${file}`)}`).default;
    commands.push(command);
}
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
exports.baseDir = baseDir;
const dictionary = new classes_1.Dictionary();
exports.dictionary = dictionary;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const meta = {
    client: null
};
exports.meta = meta;
dayjs_1.default.extend(duration_1.default);
