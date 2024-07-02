import { PrismaClient } from '@prisma/client';
import { Dictionary } from './classes';
import initDayjs from 'dayjs';

const prisma = new PrismaClient();
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary(prisma);
const dayjs = initDayjs();

export default { prisma, baseDir, dictionary, dayjs };
