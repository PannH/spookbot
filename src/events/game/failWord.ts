import { Event } from '../../classes';
import { COMMAND_PREFIXES } from '../../constants';
import { dictionary } from '../../globals';

type FailWordReason = 'mustContainSyllable' | 'notInDictionary';

export default new Event(
   'failWord',
   async (client, playerPeerId: number, reason: FailWordReason) => {
      const { currentWord: word } = client.room.round;
      if (
         playerPeerId === client.room.data.selfPeerId &&
         reason === 'notInDictionary'
      ) {
         client.emit('selfTurn');

         if (dictionary.hasWord(word)) {
            dictionary.removeWords([word]);

            client.room.sendMessage(
               `Le mot ${word.toUpperCase()} n'a pas fonctionné et a été enlevé du dictionnaire.`,
               'danger'
            );
         }
      }

      if (
         playerPeerId !== client.room.data.selfPeerId &&
         COMMAND_PREFIXES.includes(client.room.round.rawCurrentWord[0])
      ) {
         const chatter = await client.room.getChatter(playerPeerId);
         return void client.emit(
            'command',
            client.room.round.rawCurrentWord,
            chatter
         );
      }
   }
);
