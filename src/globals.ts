import { PrismaClient } from '@prisma/client';
import { Dictionary } from './classes';

const prisma = new PrismaClient();
const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';
const dictionary = new Dictionary(prisma);

export default { prisma, baseDir, dictionary };
