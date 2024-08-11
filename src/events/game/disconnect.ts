import { Event } from '../../classes';
import { handleClientReconnect } from '../../functions';

export default new Event('disconnect', async (client, reason: string) => {
   if (!client.room || !client.roomSocket || !client.gameSocket) return;

   client.roomSocket.disconnect();
   client.roomSocket = null;
   client.gameSocket.disconnect();
   client.gameSocket = null;

   await handleClientReconnect(client, reason, 'game');
});
