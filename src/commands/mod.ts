import { Command } from '../classes';

export default new Command(
   {
      name: 'mod',
      description: 'Donner le rôle modérateur à un utilisateur.',
      usage: {
         formats: ['/mod <pseudo>'],
         examples: ['/mod Joueur123']
      },
      roomOwnerOnly: true
   },
   async (client, message, args) => {
      const username = args.join(' ');

      if (!username)
         return client.room.sendMessage(
            'Veuillez indiquer un pseudo.',
            'error'
         );

      const chatters = await client.room.getChatters();
      const chatter = chatters.find((chatter) => chatter.nickname === username);

      if (!chatter)
         return client.room.sendMessage(
            `Aucun utilisateur ne correspond à "${username}".`,
            'error'
         );

      if (chatter.isModerator)
         return client.room.sendMessage(
            `${chatter.nickname} est déjà modérateur.`,
            'error'
         );

      chatter.setModerator(true);

      client.room.sendMessage(`${chatter.nickname} est désormais modérateur.`);
   }
);
