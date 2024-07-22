import { Event, type RoundPlayer } from '../../classes';
import {
   DEFAULT_ROUND_PLAYER_STATS,
   NOT_REGISTER_STATS_REASON,
   STAT_COINS_WORTH,
   STAT_NAME,
   TRAIN_CATEGORY_NAME_PLURAL,
   TRAIN_CATEGORY_NAME_SINGULAR
} from '../../constants';
import { formatStat, percentage, pluralize } from '../../functions';
import type { RoundPlayerStats } from '../../interfaces';
import type { Optional } from '../../types';
import {
   createProfile,
   getLeadRecords,
   getProfileByAuthId,
   getRecordsByProfileId
} from '../../services/db';
import { prisma } from '../../globals';
import socket from '../../socket';

export default new Event('playerDie', async (client, player: RoundPlayer) => {
   player.setStat('lifetime', Date.now() - client.room.round.startTime);

   const stats: Optional<Record<keyof RoundPlayerStats, number>> =
      Object.entries(player.stats).reduce((acc, [k, v]) => {
         if (v) acc[k] = v;

         return acc;
      }, {});

   if (!Object.values(stats).length) return;

   const earnedCoins = Math.floor(
      Object.entries(stats).reduce((acc, [k, v]) => {
         acc += STAT_COINS_WORTH[k] * v;
         return acc;
      }, 0)
   );

   client.room.sendMessage(
      `Bien joué ${player.profile.nickname} ! Voici vos scores: ${Object.entries(
         stats
      )
         .map(
            ([k, v]) =>
               `${STAT_NAME[k]} (${formatStat(k as keyof RoundPlayerStats, v)})`
         )
         .join(
            ' — '
         )}${player.profile.auth && earnedCoins ? ` ⇒ +${earnedCoins} 🪙` : ''}`
   );

   if (client.room.trainCategory)
      return client.room.sendMessage(
         `🏋️ ${player.profile.nickname}, vous avez placé ${stats[client.room.trainCategory]} / ${stats.words} ${pluralize(stats[client.room.trainCategory], TRAIN_CATEGORY_NAME_SINGULAR[client.room.trainCategory], TRAIN_CATEGORY_NAME_PLURAL[client.room.trainCategory])} (${percentage(stats[client.room.trainCategory], stats.words).toFixed(1)}%).`
      );

   if (!client.room.registerStats)
      return client.room.sendMessage(
         `Rappel: les scores ne sont pas enregistrés car ${NOT_REGISTER_STATS_REASON[client.room.notRegisterStatsReason]}.`,
         'warning'
      );

   if (!player.profile.auth)
      return client.room.sendMessage(
         'Connectez-vous avec Discord, Twitch, ou JKLM pour sauvegarder vos scores.',
         'info'
      );

   const profile =
      (await getProfileByAuthId(player.profile.auth.id)) ??
      (await createProfile({
         authId: player.profile.auth.id,
         nickname: player.profile.nickname
      }));

   const oldRecords = await getRecordsByProfileId(profile.id, client.room.mode);
   const oldLeadRecords = (await getLeadRecords(client.room.mode)).filter(
      Boolean
   );

   const newRecords = (
      await Promise.all(
         Object.entries(stats).map(([k, v]) => {
            const oldRecord = oldRecords.find((r) => r.key === k);

            if (!oldRecord || oldRecord.value < v)
               return prisma.record.upsert({
                  where: {
                     id: oldRecord?.id ?? -1
                  },
                  update: {
                     value: v
                  },
                  create: {
                     key: k,
                     value: v,
                     mode: client.room.mode,
                     profileId: profile.id
                  }
               });
         })
      )
   ).filter(Boolean);

   if (newRecords.length) {
      client.room.sendMessage(
         `🎉 Vous avez battu ${pluralize(newRecords.length, 'un', 'certains')} de vos records [${client.room.mode}]: ${newRecords
            .map((r) => {
               const oldRecord = oldRecords.find((or) => or.key === r.key);

               return `${STAT_NAME[r.key]} (${formatStat(r.key as keyof RoundPlayerStats, oldRecord?.value ?? DEFAULT_ROUND_PLAYER_STATS[r.key])} → ${formatStat(r.key as keyof RoundPlayerStats, r.value)})`;
            })
            .join(' — ')}`
      );

      const newLeadRecords = newRecords.filter((r) => {
         const leadRecord = oldLeadRecords.find((lr) => lr.key === r.key);

         return !leadRecord || leadRecord.value < r.value;
      });

      if (newLeadRecords.length) {
         const recordUpdates: {
            key: string;
            mode: string;
            oldRecord: {
               nickname: number;
               value: number;
            };
            newRecord: {
               nickname: number;
               value: number;
            };
         }[] = newLeadRecords.map((r) => {
            const oldRecord = oldLeadRecords.find((or) => or.key === r.key);

            const update: any = {
               key: r.key,
               mode: r.mode,
               newRecord: {
                  nickname: profile.nickname,
                  value: r.value
               }
            };

            if (oldRecord)
               update.oldRecord = {
                  nickname: oldRecord.Profile.nickname,
                  value: oldRecord.value
               };

            return update;
         });

         client.room.sendMessage(
            `🏆 Vous avez battu ${pluralize(newLeadRecords.length, 'un record global', 'certains records globaux')} [${client.room.mode}]: ${recordUpdates
               .map(
                  (u) =>
                     `${STAT_NAME[u.key]} (${u.oldRecord ? `${formatStat(u.key as keyof RoundPlayerStats, u.oldRecord.value)} [${u.oldRecord.nickname}] → ` : ''}${formatStat(u.key as keyof RoundPlayerStats, u.newRecord.value)})`
               )
               .join(' — ')}`
         );

         socket.emit('newLeadRecords', recordUpdates);
      }
   }

   await prisma.profile.update({
      where: {
         id: profile.id
      },
      data: {
         coins: {
            increment: earnedCoins + player.taughtWordsCount * 3
         },
         taughtWords: {
            increment: player.taughtWordsCount
         },
         playtime: {
            increment: player.stats.lifetime
         }
      }
   });
});
