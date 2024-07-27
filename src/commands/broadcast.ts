import { Command } from '../classes';
import { allClients } from '../globals';

export default new Command(
   {
      name: 'broadcast',
      description: 'Envoyer une annonce dans toutes les salles où le bot est.',
      usageFormats: ['/broadcast [message]'],
      usageExamples: ["/broadcast Le bot va redémarrer d'ici 5 minutes."],
      adminOnly: true
   },
   async (client, message) => {
      if (!message.args.length)
         return client.room.sendMessage(
            'Veuillez spécifier un message.',
            'danger'
         );

      const content = message.args.join(' ');

      for (const c of allClients) {
         c.room.sendMessage(`📢 ANNONCE: ${content}`, 'warning');
      }

      client.room.sendMessage('Annonce envoyée.', 'success');
   }
);
