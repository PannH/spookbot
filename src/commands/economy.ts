import { Command } from '../classes';
import { getPositionString } from '../functions';
import { getEconomyProfiles, getProfilesCount } from '../services/db';

export default new Command(
   {
      name: 'economy',
      aliases: ['eco'],
      description: 'Explorer le classement économique.',
      usageFormats: ['/eco [-page]'],
      usageExamples: ['/eco', '/eco -p3']
   },
   async (client, message) => {
      const pageFlag = message.flags.find((f) => f.match(/^-p\d+$/i));
      const pageIndex = pageFlag
         ? Number.parseInt(pageFlag.match(/\d+/)[0]) - 1
         : 0;

      const profiles = await getEconomyProfiles(pageIndex);
      const profilesCount = await getProfilesCount();
      const pagesCount = Math.ceil(profilesCount / 10);

      if (!pagesCount)
         return client.room.sendMessage('Aucun profil à afficher.');

      if (pageIndex >= pagesCount)
         return client.room.sendMessage(
            `La page ${pageIndex + 1} n'existe pas (dernière page: ${pagesCount}).`,
            'danger'
         );

      client.room.sendMessage(
         `Classement économique (${pageIndex + 1} / ${pagesCount}) :\n${profiles.map((p, i) => `${getPositionString(i + 10 * pageIndex)} ${p.coins} 🪙 (${p.nickname})`).join('\n')}`
      );
   }
);
