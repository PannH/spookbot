export function compactNumber(num: number): string {
   return Intl.NumberFormat('fr-FR', {
      notation: 'compact'
   }).format(num);
}
