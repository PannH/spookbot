import { Command } from '../classes';
import constants from '../constants';
import { formatStatValue } from '../functions';
import globals from '../globals';
import type { PlayerStats } from '../interfaces';
import type { Optional } from '../types';

export default new Command(
   {
      name: 'records',
      description: 'Afficher les records globaux.',
      aliases: ['rec', 'r']
   },
   async (client, message, args) => {
      const category = args[0];

      const CATEGORIES: (keyof PlayerStats)[] = [
         'adverbs',
         'creatures',
         'ethnonyms',
         'hyphens',
         'lifetime',
         'longs',
         'plants',
         'words'
      ];

      if (!category) {
         const records: Optional<
            Record<keyof PlayerStats, { username: string; value: number }>
         > = {};

         for (const CATEGORY of CATEGORIES) {
            const categoryRecord = await globals.prisma.record.findFirst({
               where: {
                  key: CATEGORY
               },
               orderBy: {
                  value: 'desc'
               },
               include: {
                  Profile: true
               }
            });

            records[CATEGORY] = {
               username: categoryRecord.Profile.username,
               value: categoryRecord.value
            };
         }

         const recordsString = Object.entries(records)
            .map(
               ([key, record]) =>
                  `${constants.PLAYER_STAT_NAMES[key]}: ${formatStatValue(key as keyof PlayerStats, record.value)}, par ${record.username}`
            )
            .join(' — ');

         client.room.sendMessage(`Records globaux: ${recordsString}`);
      } else {
         const CATEGORY_SHORTCUTS: Record<string, keyof PlayerStats> = {
            adv: 'adverbs',
            cr: 'creatures',
            eth: 'ethnonyms',
            mc: 'hyphens',
            t: 'lifetime',
            l: 'longs',
            pl: 'plants',
            m: 'words'
         };

         if (!CATEGORY_SHORTCUTS[category])
            return client.room.sendMessage(
               `Catégorie de records invalide, veuillez choisir parmi: ${Object.entries(
                  CATEGORY_SHORTCUTS
               )
                  .map(
                     ([key, value]) =>
                        `${key} (${constants.PLAYER_STAT_NAMES[value]})`
                  )
                  .join(', ')}`,
               'error'
            );

         const leadRecords = await globals.prisma.record.findMany({
            where: {
               key: CATEGORY_SHORTCUTS[category]
            },
            orderBy: {
               value: 'desc'
            },
            take: 10,
            include: {
               Profile: true
            }
         });

         const getLeadPosition = (value: number) => {
            switch (value) {
               case 1:
                  return '🥇';

               case 2:
                  return '🥈';

               case 3:
                  return '🥉';

               default:
                  return `${value}.`;
            }
         };

         const leadRecordsString = leadRecords
            .map(
               (record, index) =>
                  `${getLeadPosition(index + 1)} ${record.Profile.username} (${formatStatValue(CATEGORY_SHORTCUTS[category], record.value)})`
            )
            .join(' — ');

         client.room.sendMessage(
            `Records en ${constants.PLAYER_STAT_NAMES[CATEGORY_SHORTCUTS[category]]}: ${leadRecordsString}`
         );
      }
   }
);
