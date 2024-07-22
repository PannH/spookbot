import capitalize from 'lodash/capitalize';
import { Command } from '../classes';
import {
   CATEGORY_SHORTCUT_TO_CATEGORY,
   MODE_FLAG_TO_MODE,
   RECORD_CATEGORY_NAME
} from '../constants';
import {
   getLeadCategoryRecords,
   getLeadCategoryRecordsCount,
   getLeadRecords
} from '../services/db';
import { formatStat, getPositionString } from '../functions';
import type { Mode, RecordCategory } from '../types';
import type { RoundPlayerStats } from '../interfaces';

export default new Command(
   {
      name: 'records',
      aliases: ['rec', 'r'],
      description: 'Explorer les records.',
      usageFormats: ['/r', '/r [catégorie] [-mode] [-page]'],
      usageExamples: ['/r', '/r eth', '/r t -turbo', '/r mc -sub50 -p4']
   },
   async (client, message) => {
      const targetCategoryShortcut = message.args[0]?.toLowerCase();

      if (targetCategoryShortcut) {
         const targetCategory =
            CATEGORY_SHORTCUT_TO_CATEGORY[targetCategoryShortcut];
         const pageFlag = message.flags.find((f) => f.match(/^-p\d+$/i));
         const pageIndex = pageFlag
            ? Number.parseInt(pageFlag.match(/\d+/)[0]) - 1
            : 0;

         const targetModeFlag = message.flags
            .find((flag) => flag !== pageFlag)
            ?.toLowerCase();
         const targetMode: Mode = targetModeFlag
            ? MODE_FLAG_TO_MODE[targetModeFlag]
            : 'normal';

         if (!targetMode)
            return client.room.sendMessage(
               `Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(
                  MODE_FLAG_TO_MODE
               ).join(', ')}.`,
               'danger'
            );

         if (!targetCategory)
            return client.room.sendMessage(
               `Veuillez choisir une catégorie parmi: ${Object.entries(
                  CATEGORY_SHORTCUT_TO_CATEGORY
               )
                  .map(
                     ([shortcut, category]) =>
                        `${shortcut} (${RECORD_CATEGORY_NAME[category]})`
                  )
                  .join(', ')}.`,
               'danger'
            );

         const records = await getLeadCategoryRecords(
            targetCategory,
            targetMode,
            pageIndex
         );
         const recordsCount = await getLeadCategoryRecordsCount(
            targetCategory,
            targetMode
         );
         const pagesCount = Math.ceil(recordsCount / 10);

         if (!pagesCount)
            return client.room.sendMessage(
               `Aucun record en ${RECORD_CATEGORY_NAME[targetCategory]} [${targetMode}].`
            );

         if (pageIndex >= pagesCount)
            return client.room.sendMessage(
               `La page ${pageIndex + 1} n'existe pas (dernière page: ${pagesCount}).`,
               'danger'
            );

         client.room.sendMessage(
            `Records en ${RECORD_CATEGORY_NAME[targetCategory]} [${targetMode}] (${pageIndex + 1} / ${pagesCount}): \n${records.map((r, i) => `${getPositionString(i + 10 * pageIndex)} ${formatStat(r.key as keyof RoundPlayerStats, r.value)} (${r.Profile.nickname})`).join('\n')}`
         );
      } else {
         const targetMode: Mode = message.flags.length
            ? MODE_FLAG_TO_MODE[message.flags[0].toLowerCase()]
            : 'normal';

         if (!targetMode)
            return client.room.sendMessage(
               `Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(
                  MODE_FLAG_TO_MODE
               ).join(', ')}.`,
               'danger'
            );

         const records = await getLeadRecords(targetMode);

         const categories = Object.keys(
            RECORD_CATEGORY_NAME
         ) as RecordCategory[];

         client.room.sendMessage(
            `Records globaux [${targetMode}]:\n${categories
               .map((cat) => {
                  const record = records.find((r) => r?.key === cat);
                  return `${capitalize(RECORD_CATEGORY_NAME[cat])}: ${record ? `${formatStat(record.key as keyof RoundPlayerStats, record.value)} (${record.Profile.nickname})` : 'N/A'}`;
               })
               .join('\n')}`
         );
      }
   }
);
