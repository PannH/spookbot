import { Command } from '../classes';
import { createProfile, getProfileByAuthId } from '../services/db';

export default new Command(
   {
      name: 'createprofile',
      aliases: ['cp'],
      description: 'Créer son profil.',
      usageFormats: ['/createprofile'],
      requireAuth: true
   },
   async (client, message) => {
      const profile = getProfileByAuthId(message.chatter.profile.auth.id);

      if (profile)
         return client.room.sendMessage('Vous avez déjà un profil.', 'danger');

      await createProfile({
         authId: message.chatter.profile.auth.id,
         nickname: message.chatter.profile.nickname
      });

      client.room.sendMessage(
         'Profil créé avec succès, utilisez "/profile" pour le voir.',
         'success'
      );
   }
);
