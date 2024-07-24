import { Command } from '../classes';

export default new Command(
   {
      name: 'silent',
      description:
         'Activer / désactiver les messages du bot lors de la partie.',
      usageFormats: ['/silent'],
      roomOwnerOnly: true
   },
   (client, message) => {
      client.room.isSilent = !client.room.isSilent;

      client.room.sendMessage(
         `Mode silencieux ${client.room.isSilent ? 'activé' : 'désactivé'}.`,
         'success'
      );
   }
);
