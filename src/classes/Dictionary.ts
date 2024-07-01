import type { PrismaClient } from '@prisma/client';
import type { WordCategory } from '../types';

export default class Dictionary {
   private _cache: { word: string; categories: WordCategory[] }[] = [];

   constructor(private readonly _prisma: PrismaClient) {}

   public async initCache(): Promise<void> {
      const words = await this._prisma.word.findMany({
         select: {
            value: true,
            categories: true
         }
      });

      this._cache = words.map(({ value, categories }) => ({
         word: value,
         categories: categories as WordCategory[]
      }));
   }
}
