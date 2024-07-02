export default function compactNumber(number: number): string {
   return Intl.NumberFormat('fr-FR', {
      notation: 'compact'
   }).format(number);
}
