import { Chatter, type Client } from '.';
import { DEFAULT_ROUND_PLAYER_STATS } from '../constants';
import type { ChatterProfile, RoundPlayerStats } from '../interfaces';

export class RoundPlayer extends Chatter {
   public stats: RoundPlayerStats = structuredClone(DEFAULT_ROUND_PLAYER_STATS);
   public taughtWordsCount = 0;

   constructor(profile: ChatterProfile, client: Client) {
      super(profile, client);
   }

   public setStat(key: keyof RoundPlayerStats, value: number): void {
      this.stats[key] = value;
   }

   public incrementStat(key: keyof RoundPlayerStats, increment = 1): void {
      this.stats[key] += increment;
   }
}
