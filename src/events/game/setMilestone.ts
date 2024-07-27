import { Round, Event, RoundPlayer } from '../../classes';
import { prisma } from '../../globals';
import shuffle from 'lodash/shuffle';
import type { Milestone } from '../../types';

export default new Event(
   'setMilestone',
   async (client, milestone: Milestone) => {
      switch (milestone.name) {
         case 'round': {
            client.room.round = new Round(milestone, client);

            for (const chatter of client.room.seatingChatters)
               client.room.round.players.set(
                  chatter.profile.peerId,
                  new RoundPlayer(chatter.profile, client)
               );

            client.room.seatingChatters = [];

            if (milestone.currentPlayerPeerId === client.room.data.selfPeerId)
               client.emit('selfTurn');

            const possibleBonusWords = shuffle(
               await prisma.word.findMany({
                  where: {
                     categories: {
                        equals: []
                     },
                     value: {
                        notIn: Array.from(client.room.round.usedWords)
                     }
                  },
                  select: {
                     value: true
                  }
               })
            );
            const bonusWord = possibleBonusWords[0].value;
            client.room.round.currentBonusWord = bonusWord;

            client.room.sendMessage(
               `Le mot bonus est: ${bonusWord.toUpperCase()}`,
               'warning'
            );

            break;
         }

         case 'seating': {
            if (client.room.round) client.room.round.isOver = true;

            client.room.joinRound();
            break;
         }
      }
   }
);
