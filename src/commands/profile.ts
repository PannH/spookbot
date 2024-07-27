import { Command } from '../classes';
import { MODE_FLAG_TO_MODE, PROFILE_ROLE_NAME, STAT_NAME } from '../constants';
import { formatStat } from '../functions';
import {
   getProfileByAuthIdWithRecords,
   getProfileByNicknameWithRecords
} from '../services/db';
import { dayjs } from '../globals';
import type { Mode, ProfileRole } from '../types';
import type { RoundPlayerStats } from '../interfaces';

export default new Command(
   {
      name: 'profile',
      aliases: ['p'],
      description: "Afficher votre profil ou celui d'un autre joueur.",
      usageFormats: ['/profile', '/profile [pseudo]'],
      usageExamples: ['/profile', '/profile Joueur123']
   },
   async (client, message) => {
      const targetNickname = message.args.join(' ');

      if (message.flags.length > 1)
         return client.room.sendMessage(
            "Veuillez ne spécifier qu'un seul mode de jeu.",
            'danger'
         );

      if (!message.args.length && !message.chatter.profile.auth)
         return client.room.sendMessage(
            "Vous n'avez pas de profil, connectez-vous avec Discord, Twitch, ou JKLM pour en créer un.",
            'danger'
         );

      const targetMode: Mode = message.flags.length
         ? MODE_FLAG_TO_MODE[message.flags[0]]
         : 'normal';

      if (!targetMode)
         return client.room.sendMessage(
            `Veuillez spécifier un mode de jeu valide parmi: ${Object.keys(
               MODE_FLAG_TO_MODE
            ).join(', ')}.`,
            'danger'
         );

      const profile = !message.args.length
         ? await getProfileByAuthIdWithRecords(
              message.chatter.profile.auth.id,
              targetMode
           )
         : await getProfileByNicknameWithRecords(targetNickname, targetMode);

      if (!profile && !message.args.length)
         return client.room.sendMessage(
            'Vous n\'avez pas encore de profil, utilisez "/createprofile" pour le créer ou jouer une partie.',
            'danger'
         );

      if (!profile)
         return client.room.sendMessage(
            `Le profil "${targetNickname}" n'existe pas.`,
            'danger'
         );

      client.room.sendMessage(
         `Profil de ${profile.nickname}:\n\nRecords [${targetMode}]: ${profile.records.length ? profile.records.map((r) => `${STAT_NAME[r.key]} (${formatStat(r.key as keyof RoundPlayerStats, r.value)})`).join(' — ') : 'Aucun'}\n\nPièces: ${profile.coins} 🪙\nMots appris: ${profile.taughtWords}\nTemps de jeu: ${dayjs.duration(profile.playtime).format('HH[h] mm[m] ss[s]')}${profile.roles.length ? `\n\nRôles staff: ${(profile.roles as ProfileRole[]).map((r) => PROFILE_ROLE_NAME[r]).join(', ')}` : ''}`
      );
   }
);
