import globals from '../globals';
import type { PlayerStats } from '../interfaces';

export default function formatStatValue(
   key: keyof PlayerStats,
   value: number
): string {
   switch (key) {
      case 'timeAliveMilliseconds':
         return `${globals.dayjs.duration(value).format('HH:mm:ss')}`;

      default:
         return value.toString();
   }
}
