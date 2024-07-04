import { Command } from '../classes';

export default new Command(
   {
      name: 'unmod',
      description: "Enlever le rôle modérateur d'un utilisateur.",
      usage: {
         formats: ['/unmod <pseudo>'],
         examples: ['/unmod Joueur123']
      }
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

      if (!chatter.isModerator)
         return client.room.sendMessage(
            `${chatter.nickname} n'est pas modérateur.`,
            'error'
         );

      chatter.setModerator(false);

      client.room.sendMessage(`${chatter.nickname} n'est plus modérateur.`);
   }
);
