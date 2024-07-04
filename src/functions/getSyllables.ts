export default function getSyllables(word: string): string[] {
   let syllables: string[] = [];

   for (let i = 0; i < word.length - 1; i++) {
      for (let j = i + 2; j <= i + 3 && j <= word.length; j++) {
         const syllable = word.slice(i, j);

         syllables = [...new Set([...syllables, syllable])];
      }
   }

   return syllables.filter(
      (syllable) => !syllable.includes('-') && !syllable.includes("'")
   );
}
