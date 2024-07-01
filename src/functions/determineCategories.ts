import type { WordCategory } from '../types';

export default function determineCategories(word: string): WordCategory[] {
   const categories: WordCategory[] = [];

   if (word.includes('-')) categories.push('hyphen');
   if (word.length >= 20) categories.push('long');

   return categories;
}
