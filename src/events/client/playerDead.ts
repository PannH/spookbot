import { type Chatter, Event } from '../../classes';
import constants from '../../constants';
import { formatStatValue, percentage } from '../../functions';
import globals from '../../globals';
import type { PlayerStats } from '../../interfaces';

export default new Event(
   {
      name: 'playerDead'
   },
   async (client, chatter: Chatter) => {
      client.room.round.playersStats[chatter.peerId].lifetime =
         Date.now() - client.room.round.startTimestamp;

      const playerStats = client.room.round.playersStats[chatter.peerId];
      const playerStatsString = Object.keys(playerStats)
         .filter((statKey) => !!playerStats[statKey])
         .map(
            (statKey) =>
               `${constants.PLAYER_STAT_NAMES[statKey]} (${formatStatValue(statKey as keyof PlayerStats, playerStats[statKey])})`
         )
         .join(' — ');

      const statsCoinsWorth = Math.floor(
         Object.keys(playerStats).reduce(
            (acc, curr) =>
               acc +
               constants.STATS_COINS_VALUES[curr as keyof PlayerStats] *
                  playerStats[curr as keyof PlayerStats],
            0
         )
      );

      client.room.sendMessage(
         `Bien joué ${chatter.nickname} ! Voici vos scores pour cette partie: ${playerStatsString}${chatter.authId && statsCoinsWorth ? ` ⇒ +${statsCoinsWorth} 🪙` : ''}`
      );

      if (client.room.trainCategory)
         client.room.sendMessage(
            `🏋️ ${chatter.nickname}, vous avez placé ${playerStats[constants.CATEGORY_STATS[client.room.trainCategory]]} ${constants.WORD_CATEGORY_NAMES_PLURAL[client.room.trainCategory]} pour ${playerStats.words} mots (${percentage(playerStats[constants.CATEGORY_STATS[client.room.trainCategory]], playerStats.words).toFixed(1)}%).`
         );

      if (client.room.notCountStats)
         return client.room.sendMessage(
            `Les statistiques ne sont pas sauvegardées car ${constants.NOT_COUNT_STATS_REASONS[client.room.notCountStats.reason]}.`,
            'warning'
         );

      let profile = await chatter.getProfile();

      if (!profile) {
         if (!chatter.authId)
            return client.room.sendMessage(
               `${chatter.nickname}, connectez-vous avec Discord ou Twitch pour sauvegarder vos scores.`,
               'info'
            );

         profile = await chatter.createProfile();

         client.room.sendMessage(
            `${chatter.nickname}, votre profil a automatiquement été créé: ${profile.username} (utilisez "/setname" pour changer de nom).`,
            'info'
         );
      }

      await globals.prisma.profile.update({
         where: {
            id: profile.id
         },
         data: {
            coins: {
               increment: statsCoinsWorth
            }
         }
      });

      const beatenPersonalRecords: {
         id: number;
         key: string;
         oldValue: number;
         newValue: number;
      }[] = (
         await Promise.all(
            Object.entries(playerStats).map(async ([statKey, statValue]) => {
               const beatenRecord = await globals.prisma.record.findFirst({
                  where: {
                     profileId: profile.id,
                     key: statKey,
                     mode: client.room.mode,
                     value: {
                        lt: statValue
                     }
                  },
                  select: {
                     id: true,
                     value: true
                  }
               });

               if (beatenRecord) {
                  return {
                     id: beatenRecord.id,
                     key: statKey,
                     oldValue: beatenRecord.value,
                     newValue: statValue
                  };
               }

               return null;
            })
         )
      ).filter((record) => !!record);

      if (!beatenPersonalRecords.length) return;

      const beatenTopRecords = (
         await Promise.all(
            beatenPersonalRecords.map(async (personalRecord) => {
               const topRecord = await globals.prisma.record.findFirst({
                  where: {
                     key: personalRecord.key,
                     mode: client.room.mode
                  },
                  orderBy: {
                     value: 'desc'
                  },
                  include: {
                     Profile: true
                  }
               });

               return personalRecord.newValue > topRecord.value
                  ? topRecord
                  : null;
            })
         )
      ).filter((record) => !!record);

      await Promise.all(
         beatenPersonalRecords.map((record) =>
            globals.prisma.record.update({
               where: {
                  id: record.id
               },
               data: {
                  value: record.newValue
               }
            })
         )
      );

      if (beatenTopRecords.length)
         globals.discordSocket.emit(
            'beatenTopRecords',
            beatenTopRecords.map((topRecord) => {
               const personalRecord = beatenPersonalRecords.find(
                  (personalRecord) => personalRecord.key === topRecord.key
               );

               return {
                  key: topRecord.key,
                  mode: topRecord.mode,
                  oldData: {
                     username: topRecord.Profile.username,
                     value: topRecord.value
                  },
                  newData: {
                     username: profile.username,
                     value: personalRecord.newValue
                  }
               };
            })
         );

      const beatenPersonalRecordsString = beatenPersonalRecords
         .map(
            ({ key, oldValue, newValue }) =>
               `${constants.PLAYER_STAT_NAMES[key as keyof PlayerStats]} (${formatStatValue(key as keyof PlayerStats, oldValue)} → ${formatStatValue(key as keyof PlayerStats, newValue)})`
         )
         .join(' — ');

      client.room.sendMessage(
         `${chatter.nickname}, vous avez battu certains de vos records [${client.room.mode}]: ${beatenPersonalRecordsString}`
      );
   }
);
