import constants from '../constants';
import globals from '../globals';
import type { PlayerStats } from '../interfaces';

export default function formatStatValue(
   key: keyof PlayerStats,
   value: number
): string {
   switch (key) {
      case 'lifetime':
         return `${globals.dayjs.duration(value).format('HH:mm:ss')}`;

      case 'alpha':
         return `${constants.ALPHA_LETTERS[(value % 26) - 1].toUpperCase()} [${Math.floor(value / 26)}]`;

      default:
         return value.toString();
   }
}
