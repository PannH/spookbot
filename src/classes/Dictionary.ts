import type { PrismaClient } from '@prisma/client';
import type { WordCategory } from '../types';
import type { SearchWordsOptions } from '../interfaces';
import { determineCategories, shuffleArray } from '../functions';
import globals from '../globals';

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

      globals.logger.info(
         `Dictionary cache initialize (${this._cache.length} entries)`
      );
   }

   public async getWordCategories(word: string): Promise<WordCategory[]> {
      return (
         await this._prisma.word.findUnique({
            where: {
               value: word
            },
            select: {
               categories: true
            }
         })
      )?.categories as WordCategory[] | null;
   }

   public searchWords(
      query: string | RegExp | (string | RegExp)[],
      options?: SearchWordsOptions
   ): string[] {
      const queries = (!Array.isArray(query) ? [query] : query).map((query) =>
         typeof query === 'string' ? new RegExp(query, 'i') : query
      );

      // TODO: add protection against malicious regex
      const words = this._cache
         .filter(({ word }) => !(options?.excludes ?? []).includes(word))
         .filter(({ word }) => queries.every((query) => query.test(word)))
         .filter(({ categories }) =>
            options?.categories?.length
               ? options.categories.every((category) =>
                    categories.includes(category)
                 )
               : true
         )
         .sort((a, b) =>
            options?.pritoritizeLessCategories
               ? a.categories.length - b.categories.length
               : 0
         )
         .map(({ word }) => word);

      return (options?.shuffle ? shuffleArray(words) : words).slice(
         0,
         options?.limit ?? words.length
      );
   }

   public isWordKnown(word: string): boolean {
      return this._cache.some((element) => element.word === word);
   }

   public async addWords(words: string[]): Promise<void> {
      const elements: { value: string; categories: WordCategory[] }[] =
         words.map((word) => ({
            value: word,
            categories: determineCategories(word)
         }));

      await this._prisma.word.createMany({
         data: elements
      });

      this._cache.push(
         ...elements.map(({ value, categories }) => ({
            word: value,
            categories
         }))
      );

      globals.discordSocket.emit(
         'wordsAdded',
         elements.map(({ value }) => value)
      );
   }

   public async removeWords(words: string[]): Promise<void> {
      await this._prisma.word.deleteMany({
         where: {
            value: {
               in: words
            }
         }
      });

      this._cache = this._cache.filter(({ word }) => !words.includes(word));

      globals.discordSocket.emit('wordsRemoved', words);
   }
}
