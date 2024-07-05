import type { Profile, Record } from '@prisma/client';
import { Command } from '../classes';
import globals from '../globals';
import constants from '../constants';
import { formatStatValue } from '../functions';
import type { PlayerStats } from '../interfaces';
import type { Mode } from '../types';

export default new Command(
   {
      name: 'profile',
      description: "Afficher votre profil ou celui d'un autre joueur.",
      aliases: ['p'],
      usage: {
         formats: ['/p', '/p <pseudo> <-mode>'],
         examples: ['/p', '/p -sub500', '/p Joueur123', '/p Joueur123 -turbo']
      }
   },
   async (client, message, args) => {
      const usernames = args.filter((arg) => !arg.startsWith('-'));
      const modes = args
         .filter((arg) => arg.startsWith('-'))
         .map((arg) => arg.slice(1).toLowerCase()) as Mode[];

      const ALLOWED_MODES = Object.keys(constants.MODE_RULES) as Mode[];

      if (usernames.length > 1 || modes.length > 1)
         return client.room.sendMessage(
            "Vous ne pouvez spécifier qu'un seul pseudo et un seul mode à la fois.",
            'error'
         );

      const usernameQuery = usernames[0];
      const mode = (modes[0] || 'normal') as Mode;

      if (!ALLOWED_MODES.includes(mode))
         return client.room.sendMessage(
            `Mode "${mode}" invalide, veuillez choisir parmi: ${ALLOWED_MODES.join(', ')}.`,
            'error'
         );

      let profile: Profile & { records: Record[] };
      if (usernameQuery) {
         const matchingProfile = await globals.prisma.profile.findFirst({
            where: {
               username: usernameQuery
            },
            include: {
               records: {
                  where: { mode }
               }
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
               records: {
                  where: { mode }
               }
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
         `Profil de ${profile.username}\n\nRecords [${mode}]: ${recordsString}\n\nPièces: ${profile.coins} 🪙\nMots appris: ${profile.taughtWords}${profile.staffRole ? `\n\nRôle staff: ${constants.STAFF_ROLE_NAMES[profile.staffRole]}` : ''}`
      );
   }
);
