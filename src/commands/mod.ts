import { Command } from '../classes';

export default new Command(
   {
      name: 'mod',
      description: 'Donner le rôle modérateur à un joueur.',
      usageFormats: ['/mod [pseudo]'],
      usageExamples: ['/mod Joueur123'],
      roomOwnerOnly: true
   },
   async (client, message) => {
      const nicknameQuery = message.args.join(' ');

      if (!nicknameQuery)
         return client.room.sendMessage(
            "Veuillez spécifier un nom d'utilisateur.",
            'danger'
         );

      const chatters = await client.room.getChatters();
      const chatter = chatters.find((ch) =>
         ch.profile.nickname.match(new RegExp(nicknameQuery, 'i'))
      );

      if (!chatter)
         return client.room.sendMessage(
            'Aucun joueur trouvé avec ce nom.',
            'danger'
         );

      if (chatter.profile.roles.includes('moderator'))
         return client.room.sendMessage(
            'Ce joueur est déjà modérateur.',
            'danger'
         );

      chatter.setModerator(true);

      client.room.sendMessage(
         `${chatter.profile.nickname} est désormais modérateur.`,
         'success'
      );
   }
);
