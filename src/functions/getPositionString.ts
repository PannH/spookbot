export function getPositionString(index: number): string {
   switch (index) {
      case 0:
         return '🥇';

      case 1:
         return '🥈';

      case 2:
         return '🥉';

      default:
         return `${index + 1}.`;
   }
}
