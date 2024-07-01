import { Event, type Message } from '../../classes';
import constants from '../../constants';

export default new Event(
   {
      name: 'chat'
   },
   async (client, message: Message) => {
      const COMMAND_PREFIXES = ['.', '!', '/'];

      if (
         COMMAND_PREFIXES.some((PREFIX) => message.content.startsWith(PREFIX))
      ) {
         const args = message.content.split(/ +/gm);
         const commandName = args.shift().slice(1).toLowerCase();
         const command =
            client.commands.get(commandName) ??
            [...client.commands.values()].find((command) =>
               command.options.aliases.includes(commandName)
            );

         if (!command) return;

         const { requireAuth, roomOwnerOnly, adminOnly, requiredStaffRoles } =
            command.options;

         if (requireAuth && !message.chatter.authId)
            return client.room.sendMessage(
               'Vous devez être connecté(e) avec Discord ou Twitch pour utiliser cette commande.',
               'error'
            );

         const profile = await message.chatter.getProfile();

         if (adminOnly && profile?.staffRole !== 'ADMIN')
            return client.room.sendMessage(
               'Vous devez être Administrateur du bot pour utiliser cette commande.',
               'error'
            );

         if (
            requiredStaffRoles &&
            !requiredStaffRoles.includes(profile?.staffRole) &&
            profile?.staffRole !== 'ADMIN'
         ) {
            const missingRole = requiredStaffRoles.find(
               (role) => role !== profile?.staffRole
            );

            return client.room.sendMessage(
               !profile?.staffRole
                  ? 'Vous devez faire partie du staff du bot pour utiliser cette commande.'
                  : `Vous devez être ${constants.STAFF_ROLE_NAMES[missingRole]} du bot pour utiliser cette commande.`,
               'error'
            );
         }

         // TODO: Check if the user is the owner of the room
         if (roomOwnerOnly && profile?.staffRole !== 'ADMIN')
            return client.room.sendMessage(
               'Vous devez être le propriétaire de la salle pour utiliser cette commande.',
               'error'
            );

         command.callback(client, message, args);
      }
   }
);
