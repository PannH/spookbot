import { Command } from '../classes';

export default new Command(
   {
      name: 'unmod',
      description: "Enlever le rôle modérateur d'un joueur.",
      usageFormats: ['/unmod [pseudo]'],
      usageExamples: ['/unmod Joueur123'],
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

      if (chatter.profile.peerId === message.chatter.profile.peerId)
         return client.room.sendMessage(
            'Vous ne pouvez pas enlever le rôle de vous-même.'
         );

      if (!chatter.profile.roles.includes('moderator'))
         return client.room.sendMessage(
            "Ce joueur n'est pas modérateur.",
            'danger'
         );

      chatter.setModerator(false);

      client.room.sendMessage(
         `${chatter.profile.nickname} n'est plus modérateur.`,
         'success'
      );
   }
);
