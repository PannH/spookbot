import { relative } from 'node:path';
import { readdirSync } from 'node:fs';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { Logger } from 'beautify-logs';
import { Dictionary, type Command, type Client } from './classes';

const logger = new Logger({
   format: 1
});

try {
   const { PrismaClient } = require('@prisma/client');
   new PrismaClient();
} catch (error) {
   logger.info('Generating Prisma client...');
   execSync('npm run prisma:generate');
}

logger.info('Deploying Prisma migrations...');

execSync('npm run prisma:deploy');

const commands: Command[] = [];

const commandsPath = `${__dirname}/commands`;

for (const file of readdirSync(commandsPath)) {
   const command: Command = require(
      `./${relative(__dirname, `${commandsPath}/${file}`)}`
   ).default;

   commands.push(command);
}

const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary();
const prisma = new PrismaClient();
const meta: { client: Client | null } = {
   client: null
};
const allClients: Client[] = [];

dayjs.extend(durationPlugin);

export {
   commands,
   baseDir,
   dictionary,
   dayjs,
   prisma,
   meta,
   logger,
   allClients
};
