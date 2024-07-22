import type { RoundMilestone } from '../interfaces';
import type { Client, RoundPlayer } from '.';

export class Round {
   public isOver = false;
   public startTime = Date.now();
   public usedWords: Set<string> = new Set();
   public previousSyllable: string;
   public currentSyllable: string;
   public players: Map<number, RoundPlayer> = new Map();
   public rawCurrentWord = '';
   public isIdle = false;
   public currentBonusWord: string | null = null;

   constructor(
      private readonly _milestone: RoundMilestone,
      private readonly _client: Client
   ) {
      this.previousSyllable = _milestone.syllable;
      this.currentSyllable = _milestone.syllable;
   }

   public get currentWord(): string {
      return this.rawCurrentWord.replace(/[^a-z'-]/g, '');
   }

   public setWord(word: string, submit = true): void {
      this._client.gameSocket.emit('setWord', word, submit);
   }
}
