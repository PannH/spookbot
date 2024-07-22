import { Chatter, Event } from '../../classes';
import { COMMAND_PREFIXES } from '../../constants';
import type { ChatterProfile } from '../../interfaces';

export default new Event(
   'chat',
   async (
      client,
      chatterProfile: ChatterProfile,
      content: string,
      customProperties: Record<string, string>
   ) => {
      if (COMMAND_PREFIXES.includes(content[0]))
         return void client.emit(
            'command',
            content,
            new Chatter(chatterProfile, client)
         );
   }
);
