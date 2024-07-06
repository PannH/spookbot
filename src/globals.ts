import { PrismaClient } from '@prisma/client';
import { Dictionary } from './classes';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Logger } from 'beautify-logs';

dayjs.extend(durationPlugin);

const prisma = new PrismaClient();
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary(prisma);
const logger = new Logger({
   format: 1
});

export default { prisma, baseDir, dictionary, dayjs, logger };
