import type { WordCategory } from '../types';

export function determineCategories(word: string): WordCategory[] {
   const categories: WordCategory[] = [];

   if (word.length >= 20) categories.push('long');
   if (word.includes('-')) categories.push('hyphen');

   return categories;
}
