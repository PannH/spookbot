import { Command } from '../classes';
import {
   blacklistUser,
   getBlacklist,
   getBlacklistUser,
   unblacklistUser
} from '../services/db';

export default new Command(
   {
      name: 'blacklist',
      description: 'Gérer les joueurs blacklistés',
      aliases: ['bl'],
      usageFormats: [
         '/blacklist add [auth] [raison]',
         '/blacklist remove [auth]',
         '/blacklist list'
      ],
      usageExamples: [
         '/blacklist add 1234567890',
         '/blacklist remove 1234567890',
         '/blacklist list'
      ],
      adminOnly: true
   },
   async (client, message) => {
      const subcommand = message.args[0]?.toLowerCase();

      if (!subcommand)
         return client.room.sendMessage(
            'Veuillez spécifié une sous-commande.',
            'danger'
         );

      switch (subcommand) {
         case 'add': {
            const authId = message.args[1];
            const reason = message.args.slice(2).join(' ');

            if (!authId || !reason)
               return client.room.sendMessage(
                  "Veuillez spécifier l'auth et la raison de l'ajoute dans la blacklist.",
                  'danger'
               );

            await blacklistUser(authId, reason);

            const chatters = await client.room.getChatters();
            const blacklistedChatter = chatters.find(
               (c) => c.profile.auth?.id === authId
            );

            if (blacklistedChatter) blacklistedChatter.ban();

            client.room.sendMessage(
               `L'utilisateur "${blacklistedChatter?.profile?.nickname ?? authId}" a été blacklisté pour: ${reason}.`,
               'success'
            );

            break;
         }

         case 'remove': {
            const authId = message.args[1];

            const blacklistUser = await getBlacklistUser(authId);

            if (!blacklistUser)
               return client.room.sendMessage(
                  "Cet utilisateur n'est pas blacklisté.",
                  'danger'
               );

            await unblacklistUser(authId);

            const chatters = await client.room.getChatters();
            const unblacklistedChatter = chatters.find(
               (c) => c.profile.auth?.id === authId
            );

            if (unblacklistedChatter) unblacklistedChatter.unban();

            client.room.sendMessage(
               `L'utilisateur "${unblacklistedChatter?.profile?.nickname ?? authId}" a été retiré de la blacklist.`,
               'success'
            );

            break;
         }

         case 'list': {
            const blacklistUsers = await getBlacklist();

            if (!blacklistUsers.length)
               return client.room.sendMessage('La blacklist est vide.');

            client.room.sendMessage(
               `Blacklist (${blacklistUsers.length}):\n${blacklistUsers.map((bl) => `${bl.authId}: ${bl.reason}`).join('\n')}`
            );

            break;
         }

         default:
            return client.room.sendMessage(
               'Veuillez spécifier une sous-commande valide (voir "/help blacklist").'
            );
      }
   }
);
