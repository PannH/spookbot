import type { WordCategory } from '../types';

export default interface SearchWordsOptions {
   categories?: WordCategory[];
   excludes?: string[];
   shuffle?: boolean;
   limit?: number;
   pritoritizeLessCategories?: boolean;
}
