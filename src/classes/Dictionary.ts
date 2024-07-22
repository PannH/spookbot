import { createWords, deleteWords, getWords } from '../services/db';
import { determineCategories } from '../functions';
import type { WordCategory } from '../types';
import type { Word } from '@prisma/client';
import socket from '../socket';
import { logger } from '../globals';

interface SearchWordsOptions {
   excludeSet?: Set<string>;
   withCategories?: WordCategory[];
}

export class Dictionary {
   private _words: Set<string> = new Set();
   private _wordsCategories: Map<string, WordCategory[]> = new Map();

   public async initCache(): Promise<void> {
      const words = await getWords();

      for (const { value, categories } of words) {
         this._words.add(value);
         if (categories.length) this._wordsCategories.set(value, categories);
      }

      logger.info(`Dictionary cache initialized (${this._words.size} words)`);
   }

   public async searchWords(
      query: string | RegExp,
      options?: SearchWordsOptions
   ): Promise<string[]> {
      if (!this._words.size)
         throw new Error('Dictionary cache not initialized');

      const { excludeSet = new Set(), withCategories = [] } = options ?? {};

      const queryRegex =
         query instanceof RegExp ? query : new RegExp(query, 'i');

      const matchingWords = Array.from(this._words).filter(
         (word) =>
            !excludeSet.has(word) &&
            queryRegex.test(word) &&
            (!withCategories.length ||
               withCategories.every((c) =>
                  this._wordsCategories.get(word)?.includes(c)
               ))
      );

      return matchingWords;
   }

   public hasWord(word: string): boolean {
      return this._words.has(word);
   }

   public async addWords(
      words: string[],
      authorAuthId?: string
   ): Promise<void> {
      const data: Omit<Word, 'id'>[] = words.map((value) => ({
         value,
         categories: determineCategories(value)
      }));

      for (const { value, categories } of data as {
         value: string;
         categories: WordCategory[];
      }[]) {
         this._words.add(value);
         if (categories.length) this._wordsCategories.set(value, categories);
      }

      socket.emit('wordsAdd', words, authorAuthId);

      await createWords(data);
   }

   public async removeWords(
      words: string[],
      authorAuthId?: string
   ): Promise<void> {
      for (const word of words) {
         this._words.delete(word);
         this._wordsCategories.delete(word);
      }

      socket.emit('wordsRemove', words, authorAuthId);

      await deleteWords(words);
   }

   public getWordCategories(word: string): WordCategory[] {
      return this._wordsCategories.get(word) ?? [];
   }
}
