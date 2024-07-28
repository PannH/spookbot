import { Round, Event, RoundPlayer } from '../../classes';
import { dictionary } from '../../globals';
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

            const bonusWord = await dictionary.getRandomBonusWord(
               client.room.round.usedWords
            );
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
