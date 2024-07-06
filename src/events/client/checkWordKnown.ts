import { Event } from '../../classes';
import globals from '../../globals';

export default new Event(
   {
      name: 'checkWordKnown'
   },
   async (client, word: string, playerPeerId: number) => {
      if (!globals.dictionary.isWordKnown(word)) {
         const chatter = await client.room.getChatter(playerPeerId);

         await globals.dictionary.addWord(word);

         client.room.sendMessage(
            `Merci ${chatter.nickname} ! Tu as appris le mot ${word.toUpperCase()} au bot${chatter.authId ? ' (+3 🪙)' : ''}.`,
            'info'
         );

         if (chatter.authId) {
            await globals.prisma.profile.update({
               where: {
                  authId: chatter.authId
               },
               data: {
                  taughtWords: {
                     increment: 1
                  },
                  coins: {
                     increment: 3
                  }
               }
            });
         }
      }
   }
);
