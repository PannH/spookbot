import { Event } from '../../classes';
import {
   CATEGORY_NAME_WITH_ARTICLE,
   CATEGORY_TO_STAT,
   TRAIN_CATEGORY_TO_WORD_CATEGORY
} from '../../constants';
import {
   formatStat,
   getSyllables,
   percentage,
   pluralize
} from '../../functions';
import { dictionary, prisma } from '../../globals';
import { getWordCategories } from '../../services/db';
import shuffle from 'lodash/shuffle';

export default new Event(
   'correctWord',
   async (client, { playerPeerId }: { playerPeerId: number }) => {
      if (!client.room.round) return;

      const word = client.room.round.currentWord;

      client.room.round.usedWords.add(word);

      if (playerPeerId === client.room.data.selfPeerId) return;

      const player = client.room.round.players.get(playerPeerId);

      if (!dictionary.hasWord(word)) {
         dictionary.addWords([word], player.profile.auth?.id);
         client.room.sendMessage(
            `Merci ${player.profile.nickname} ! Vous avez appris le mot ${word.toUpperCase()} au bot${player.profile.auth ? ' (+3 🪙)' : ''}.`,
            'info'
         );
         player.taughtWordsCount++;
      }

      player.incrementStat('words');

      const wordCategories = await getWordCategories(word);

      for (const category of wordCategories)
         player.incrementStat(CATEGORY_TO_STAT[category]);

      const currentAlphaIndex = player.stats.alpha % 26;
      const wordAlphaIndex = word.charCodeAt(0) - 97;

      if (currentAlphaIndex === wordAlphaIndex) {
         player.incrementStat('alpha');
         wordCategories.push('alpha');
      }

      if (client.room.round.currentBonusWord === word) {
         player.incrementStat('bonusWords');
         wordCategories.push('bonus');

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
            `Le nouveau mot bonus est: ${bonusWord.toUpperCase()}`
         );
      }

      if (client.room.trainCategory) {
         if (
            wordCategories.includes(
               TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]
            )
         )
            client.room.sendMessage(
               `✅ ${player.profile.nickname} a placé ${CATEGORY_NAME_WITH_ARTICLE[TRAIN_CATEGORY_TO_WORD_CATEGORY[client.room.trainCategory]]} (${player.stats[client.room.trainCategory]}, ${percentage(player.stats[client.room.trainCategory], player.stats.words).toFixed(1)}%): ${word.toUpperCase()}`
            );
         else client.emit('trainHints', client.room.round.previousSyllable);
      }

      if (wordCategories.length && !client.room.trainCategory)
         client.room.sendMessage(
            `${player.profile.nickname} a placé ${wordCategories.map((category) => `${CATEGORY_NAME_WITH_ARTICLE[category]} (${formatStat(CATEGORY_TO_STAT[category], player.stats[CATEGORY_TO_STAT[category]])})`).join(', ')}: ${word.toUpperCase()}`
         );

      const wordSyllables = getSyllables(word);
      const wordsPerSyllable = await Promise.all(
         wordSyllables.map(
            async (syl) =>
               (
                  await dictionary.searchWords(syl, {
                     excludeSet: client.room.round.usedWords
                  })
               ).length
         )
      );
      const fuckedSyllables: string[] = wordSyllables.filter(
         (syl, i) => !wordsPerSyllable[i]
      );

      if (fuckedSyllables.length) {
         player.incrementStat('fuckedSyllables', fuckedSyllables.length);

         if (!client.room.trainCategory)
            client.room.sendMessage(
               `${player.profile.nickname} a niqué ${pluralize(fuckedSyllables.length, 'la syllabe', 'les syllabes')} ${fuckedSyllables.map((syl) => syl.toUpperCase()).join(', ')} (${player.stats.fuckedSyllables}): ${word.toUpperCase()}`
            );
      }
   }
);
