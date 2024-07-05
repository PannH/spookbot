import { type Chatter, Event } from '../../classes';
import constants from '../../constants';
import { formatStatValue } from '../../functions';
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
         `Bien joué ${chatter.nickname} ! Voici vos scores pour cette partie: ${playerStatsString}${chatter.authId ? ` ⇒ +${statsCoinsWorth} 🪙` : ''}`
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

      const beatenRecords: {
         [key: string]: { oldValue: number; newValue: number };
      } = {};
      for (const [statKey, statValue] of Object.entries(playerStats)) {
         const beatenRecord = await globals.prisma.record.findFirst({
            where: {
               profileId: profile.id,
               key: statKey,
               mode: client.room.mode,
               value: {
                  lt: statValue
               }
            }
         });

         if (beatenRecord) {
            beatenRecords[statKey] = {
               oldValue: beatenRecord.value,
               newValue: statValue
            };

            await globals.prisma.record.update({
               where: {
                  id: beatenRecord.id,
                  key: statKey,
                  mode: client.room.mode
               },
               data: {
                  value: statValue
               }
            });
         }
      }

      if (Object.keys(beatenRecords).length) {
         const beatenRecordsString = Object.entries(beatenRecords)
            .map(
               ([statKey, { oldValue, newValue }]) =>
                  `${constants.PLAYER_STAT_NAMES[statKey as keyof PlayerStats]} (${formatStatValue(statKey as keyof PlayerStats, oldValue)} → ${formatStatValue(statKey as keyof PlayerStats, newValue)})`
            )
            .join(' — ');

         client.room.sendMessage(
            `${chatter.nickname}, vous avez battu certains de vos records [${client.room.mode}]: ${beatenRecordsString}`
         );
      }
   }
);
