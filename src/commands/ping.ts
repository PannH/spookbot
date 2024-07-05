import { Command } from '../classes';

export default new Command(
   {
      name: 'ping',
      description: 'Voir la latence moyenne du bot.',
      usage: {
         formats: ['/ping']
      }
   },
   async (client, message, args) => {
      const startTimestamp = Date.now();

      client.roomSocket.emit('getChatterProfiles', () => {
         const latencyMs = Date.now() - startTimestamp;
         client.room.sendMessage(`Latence moyenne: ${latencyMs}ms`);
      });
   }
);
