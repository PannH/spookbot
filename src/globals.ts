import { PrismaClient } from '@prisma/client';
import { Dictionary } from './classes';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

const prisma = new PrismaClient();
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary(prisma);

export default { prisma, baseDir, dictionary, dayjs };
