import { Command } from '../classes';
import {
   getProfileByAuthId,
   getProfileByNickname,
   updateProfileNickname
} from '../services/db';

export default new Command(
   {
      name: 'setname',
      description: 'Modifier le nom de son profil.',
      usageFormats: ['/setname [nouveau_pseudo]'],
      usageExamples: ['/setname Joueur123'],
      requireAuth: true
   },
   async (client, message) => {
      const profile = await getProfileByAuthId(message.chatter.profile.auth.id);

      if (!profile)
         return client.room.sendMessage(
            'Vous n\'avez pas de profil, utilisez "/createprofile" pour le créer.',
            'danger'
         );

      if (!message.args.length)
         return client.room.sendMessage(
            'Veuillez spécifier un nouveau nom.',
            'danger'
         );

      const newNickname = message.args.join(' ');

      if (profile.nickname.toLowerCase() === newNickname.toLowerCase())
         return client.room.sendMessage(
            'Votre nom est déjà celui spécifié.',
            'danger'
         );

      if (newNickname.length < 2 || newNickname.length > 20)
         return client.room.sendMessage(
            'Le nom doit contenir entre 2 et 20 caractères.',
            'danger'
         );

      const sameNicknameProfile = await getProfileByNickname(newNickname);

      if (sameNicknameProfile)
         return client.room.sendMessage(
            'Ce nom est déjà utilisé par un autre joueur.',
            'danger'
         );

      await updateProfileNickname(profile.id, newNickname);

      client.room.sendMessage(
         `Nom modifié avec succès: ${profile.nickname} → ${newNickname}`,
         'success'
      );
   }
);
