import { Command } from '../classes';
import constants from '../constants';
import { capitalize, formatStatValue } from '../functions';
import globals from '../globals';
import type { PlayerStats } from '../interfaces';
import type { Optional, Mode } from '../types';

export default new Command(
   {
      name: 'records',
      description: 'Afficher les records globaux.',
      aliases: ['rec', 'r'],
      usage: {
         formats: ['/r', '/r <catégorie> <-mode>'],
         examples: ['/r', '/r eth', '/r l -turbo', '/r -sub50']
      }
   },
   async (client, message, args) => {
      const modes = args
         .filter((arg) => arg.startsWith('-'))
         .map((arg) => arg.slice(1).toLowerCase());
      const categories = args
         .filter((arg) => !arg.startsWith('-'))
         .map((arg) => arg.toLowerCase());

      const CATEGORIES: (keyof PlayerStats)[] = [
         'adverbs',
         'creatures',
         'ethnonyms',
         'hyphens',
         'lifetime',
         'longs',
         'plants',
         'words',
         'lives',
         'alpha',
         'fuckedSyllables'
      ];

      if (modes.length > 1 || categories.length > 1)
         return client.room.sendMessage(
            `Veuillez ne specifier qu'un mode, qu'une catégorie, ou qu'un de chaque.`,
            'error'
         );

      const mode = (modes[0] ?? 'normal') as Mode;
      const ALLOWED_MODES = Object.keys(constants.MODE_RULES) as Mode[];

      if (!ALLOWED_MODES.includes(mode))
         return client.room.sendMessage(
            `Mode "-${mode}" inconnu, veuillez choisir parmi: ${ALLOWED_MODES.map((mode) => `-${mode}`).join(', ')}`,
            'error'
         );

      if (!categories.length) {
         const records: Optional<
            Record<keyof PlayerStats, { username: string; value: number }>
         > = {};

         for (const CATEGORY of CATEGORIES) {
            const categoryRecord = await globals.prisma.record.findFirst({
               where: {
                  key: CATEGORY,
                  mode
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
                  `${capitalize(constants.PLAYER_STAT_NAMES[key])}: ${formatStatValue(key as keyof PlayerStats, record.value)} (${record.username})`
            )
            .join('\n');

         client.room.sendMessage(
            `Records globaux [${mode}]:\n${recordsString}`
         );
      } else {
         const category = categories[0];
         const CATEGORY_SHORTCUTS: Record<string, keyof PlayerStats> = {
            adv: 'adverbs',
            cr: 'creatures',
            eth: 'ethnonyms',
            mc: 'hyphens',
            t: 'lifetime',
            l: 'longs',
            pl: 'plants',
            m: 'words',
            v: 'lives',
            a: 'alpha',
            sn: 'fuckedSyllables'
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
               key: CATEGORY_SHORTCUTS[category],
               mode
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
                  `${getLeadPosition(index + 1)} ${formatStatValue(CATEGORY_SHORTCUTS[category], record.value)} (${record.Profile.username})`
            )
            .join('\n');

         client.room.sendMessage(
            `Records en ${constants.PLAYER_STAT_NAMES[CATEGORY_SHORTCUTS[category]]} [${mode}]:\n${leadRecordsString}`
         );
      }
   }
);
