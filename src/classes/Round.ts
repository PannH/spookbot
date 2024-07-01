import type { Client } from '.';
import type { RoundMilestone } from '../interfaces';

export default class Round {
   public syllable: string;
   public playerPeerId: number;
   public currentWord = '';
   public setWords: string[] = [];

   constructor(
      private readonly _milestone: RoundMilestone,
      private readonly _client: Client
   ) {
      this.syllable = _milestone.syllable;
      this.playerPeerId = _milestone.currentPlayerPeerId;
   }

   public setWord(word: string, submit = true): void {
      this._client.gameSocket.emit('setWord', word, submit);
   }
}
