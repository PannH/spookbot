import type { Profile, Record } from '@prisma/client';
import { Command } from '../classes';
import globals from '../globals';
import constants from '../constants';
import { formatStatValue } from '../functions';
import type { PlayerStats } from '../interfaces';

export default new Command(
   {
      name: 'profile',
      description: "Afficher votre profil ou celui d'un autre joueur.",
      aliases: ['p'],
      usage: {
         formats: ['/p', '/p <pseudo>'],
         examples: ['/p', '/p Joueur123']
      }
   },
   async (client, message, args) => {
      const usernameQuery = args[0];

      let profile: Profile & { records: Record[] };
      if (usernameQuery) {
         const matchingProfile = await globals.prisma.profile.findFirst({
            where: {
               username: usernameQuery
            },
            include: {
               records: true
            }
         });

         if (!matchingProfile)
            return client.room.sendMessage(
               `Aucun profil trouvé pour la recherche "${usernameQuery}". Veuillez vérifier l'orthographe.`,
               'error'
            );

         profile = matchingProfile;
      } else {
         if (!message.chatter.authId)
            return client.room.sendMessage(
               "Vous n'avez pas de profil. Jouez une partie en étant connecté avec Discord ou Twitch pour le créer automatiquement.",
               'error'
            );

         profile = await globals.prisma.profile.findUnique({
            where: {
               authId: message.chatter.authId
            },
            include: {
               records: true
            }
         });

         if (!profile)
            return client.room.sendMessage(
               "Vous n'avez pas de profil. Jouez une partie pour le créer automatiquement.",
               'error'
            );
      }

      const recordsString = profile.records
         .map(
            ({ key, value }) =>
               `${constants.PLAYER_STAT_NAMES[key]} (${formatStatValue(key as keyof PlayerStats, value)})`
         )
         .join(' — ');

      client.room.sendMessage(
         `Profil de ${profile.username}: ${recordsString}`
      );
   }
);
