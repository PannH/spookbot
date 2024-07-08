import { PrismaClient } from '@prisma/client';
import { Dictionary } from './classes';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Logger } from 'beautify-logs';
import type { Server } from 'socket.io';
import { execSync } from 'node:child_process';

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

dayjs.extend(durationPlugin);

const prisma = new PrismaClient();
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary(prisma);
const discordSocket: null | Server = null;

export default { prisma, baseDir, dictionary, dayjs, logger, discordSocket };
