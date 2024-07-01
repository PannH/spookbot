import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const baseDir = __dirname.endsWith('src') ? 'src' : 'dist';

export default { prisma, baseDir };
