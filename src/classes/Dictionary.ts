import type { PrismaClient } from '@prisma/client';
import type { WordCategory } from '../types';
import type { SearchWordsOptions } from '../interfaces';
import { determineCategories, shuffleArray } from '../functions';

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

   public searchWords(
      query: string | RegExp | (string | RegExp)[],
      options?: SearchWordsOptions
   ): string[] {
      const queries = (!Array.isArray(query) ? [query] : query).map((query) =>
         typeof query === 'string' ? new RegExp(query, 'i') : query
      );

      const matchingElements = this._cache.filter(({ word, categories }) => {
         if (
            options?.categories?.length &&
            !options.categories.every((category) =>
               categories.includes(category)
            )
         )
            return false;

         if (
            options?.excludes?.length &&
            options.excludes.some((exclude) => word === exclude)
         )
            return false;

         // TODO: add protection against malicious regex

         return !queries.length
            ? true
            : queries.some((query) => query.test(word));
      });

      const words = matchingElements.map((element) => element.word);
      return options?.shuffle ? shuffleArray(words) : words;
   }

   public isWordKnown(word: string): boolean {
      return this._cache.some((element) => element.word === word);
   }

   public async addWord(word: string): Promise<void> {
      const categories = determineCategories(word);

      await this._prisma.word.create({
         data: {
            value: word,
            categories
         }
      });

      this._cache.push({ word, categories });
   }

   public async removeWord(word: string): Promise<void> {
      await this._prisma.word.delete({
         where: {
            value: word
         }
      });

      this._cache = this._cache.filter((element) => element.word !== word);
   }
}
