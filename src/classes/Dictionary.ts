import { createWords, deleteWords, getWords } from '../services/db';
import { determineCategories, pickRandom } from '../functions';
import type { WordCategory } from '../types';
import type { Word } from '@prisma/client';
import socket from '../socket';
import { logger } from '../globals';
import shuffle from 'lodash/shuffle';

interface SearchWordsOptions {
   excludeSet?: Set<string>;
   withCategories?: WordCategory[];
   noCategoriesOnly?: boolean;
}

export class Dictionary {
   public words: Set<string> = new Set();
   public wordsCategories: Map<string, WordCategory[]> = new Map();

   public async initCache(): Promise<void> {
      const words = await getWords();

      for (const { value, categories } of words) {
         this.words.add(value);
         if (categories.length) this.wordsCategories.set(value, categories);
      }

      logger.info(`Dictionary cache initialized (${this.words.size} words)`);
   }

   public async searchWords(
      query: string | RegExp,
      options?: SearchWordsOptions
   ): Promise<string[]> {
      if (!this.words.size) throw new Error('Dictionary cache not initialized');

      const { excludeSet = new Set(), withCategories = [] } = options ?? {};

      const queryRegex =
         query instanceof RegExp ? query : new RegExp(query, 'i');

      const matchingWords = Array.from(this.words).filter(
         (word) =>
            !excludeSet.has(word) &&
            queryRegex.test(word) &&
            (!withCategories.length ||
               withCategories.every((c) =>
                  this.wordsCategories.get(word)?.includes(c)
               )) &&
            (!options?.noCategoriesOnly || !this.getWordCategories(word).length)
      );

      return matchingWords;
   }

   public hasWord(word: string): boolean {
      return this.words.has(word);
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
         this.words.add(value);
         if (categories.length) this.wordsCategories.set(value, categories);
      }

      socket.emit('wordsAdd', words, authorAuthId);

      await createWords(data);
   }

   public async removeWords(
      words: string[],
      authorAuthId?: string
   ): Promise<void> {
      for (const word of words) {
         this.words.delete(word);
         this.wordsCategories.delete(word);
      }

      socket.emit('wordsRemove', words, authorAuthId);

      await deleteWords(words);
   }

   public getWordCategories(word: string): WordCategory[] {
      return this.wordsCategories.get(word) ?? [];
   }

   public async getRandomBonusWord(excludeSet: Set<string>): Promise<string> {
      const words = await this.searchWords(/./, {
         excludeSet,
         noCategoriesOnly: true
      });

      const randomWord = pickRandom(shuffle(words).slice(0, 10));

      return randomWord;
   }
}
