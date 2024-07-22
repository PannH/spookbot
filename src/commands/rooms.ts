import { Command } from '../classes';
import { getActiveRooms, getProfileByAuthId } from '../services/db';

export default new Command(
   {
      name: 'rooms',
      description: 'Voir la liste des salles actives.',
      usageFormats: ['rooms'],
      trustedOnly: true
   },
   async (client, message) => {
      const activeRooms = await getActiveRooms();

      const rooms = await Promise.all(
         activeRooms.map(async (r) => ({
            roomCode: r.code,
            ownerProfile: await getProfileByAuthId(r.ownerAuthId),
            isDefault: r.isDefault
         }))
      );

      client.room.sendMessage(
         `Salles actives (${activeRooms.length}):\n${rooms.map((r) => `${r.roomCode} (${r.isDefault ? 'défaut' : r.ownerProfile.nickname})`).join('\n')}`
      );
   }
);
