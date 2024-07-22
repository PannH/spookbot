import { ALPHA_LETTERS } from '../constants';
import { dayjs } from '../globals';
import type { RoundPlayerStats } from '../interfaces';

export function formatStat(key: keyof RoundPlayerStats, value: number): string {
   switch (key) {
      case 'lifetime':
         return dayjs.duration(value).format('HH:mm:ss');

      case 'alpha':
         return value
            ? `${ALPHA_LETTERS[(value % 26) - 1].toUpperCase()} [${Math.floor(value / 26)}]`
            : '∅';

      default:
         return value.toString();
   }
}
