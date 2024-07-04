import { Command } from '../classes';
import { simplifyString } from '../functions';
import globals from '../globals';

export default new Command(
   {
      name: 'setname',
      description: 'Modifier le nom de votre profil.',
      usage: {
         formats: ['/setname <pseudo>'],
         examples: ['/setname Joueur123']
      }
   },
   async (client, message, args) => {
      if (!args.length)
         return client.room.sendMessage(
            'Veuillez indiquer un nouveau nom pour votre profil.',
            'error'
         );

      const profile = await message.chatter.getProfile();

      if (!profile)
         return client.room.sendMessage(
            "Vous n'avez pas de profil. Jouez une partie pour en créer un automatiquement.",
            'error'
         );

      const newUsername = args.join(' ');

      if (newUsername.length < 2 || newUsername.length > 20)
         return client.room.sendMessage(
            'Votre nouveau nom doit faire entre 2 et 20 caractères.',
            'error'
         );

      const sameUsernameProfile = await globals.prisma.profile.findFirst({
         where: {
            username: newUsername
         }
      });

      if (sameUsernameProfile)
         return client.room.sendMessage(
            "Un autre profil existe déjà avec ce nom d'utilisateur.",
            'error'
         );

      await globals.prisma.profile.update({
         where: {
            id: profile.id
         },
         data: {
            username: newUsername
         }
      });

      client.room.sendMessage(
         `Votre nom a bien été modifié: ${profile.username} → ${newUsername}.`
      );
   }
);
