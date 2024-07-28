import { Chatter, type Client } from '.';
import { DEFAULT_RULES, MODE_RULES } from '../constants';
import type { ChatterProfile, RoomData, Rules } from '../interfaces';
import { deleteRoomByCode } from '../services/db';
import type {
   GameId,
   Mode,
   NotRegisterStatsReason,
   Optional,
   Playstyle,
   TrainCategory
} from '../types';
import type { Round } from './Round';

type MessageVariant = 'default' | 'danger' | 'success' | 'info' | 'warning';

export class Room {
   public round: Round | null = null;
   public seatingChatters: Chatter[] = [];
   public mode: Mode | null = 'normal';
   public trainCategory: TrainCategory | null = null;
   public trainRegex: RegExp | null = null;
   public registerStats = true;
   public notRegisterStatsReason: NotRegisterStatsReason | null = null;
   public playstyle: Playstyle = 'normal';
   public destroyTimeout: NodeJS.Timeout | null = null;
   public isSilent = false;

   constructor(
      public data: RoomData,
      private _client: Client
   ) {}

   public updateClient(client: Client): void {
      this._client = client;
   }

   public updateData(data: RoomData): void {
      this.data = data;
   }

   public async destroy(): Promise<void> {
      await deleteRoomByCode(this.data.roomEntry.roomCode);

      this.quit();
   }

   public async getChatters(): Promise<Chatter[]> {
      return new Promise<Chatter[]>((resolve) => {
         this._client.roomSocket.emit(
            'getChatterProfiles',
            (chatterProfiles: ChatterProfile[]) =>
               resolve(
                  chatterProfiles.map(
                     (chatterProfile) =>
                        new Chatter(chatterProfile, this._client)
                  )
               )
         );
      });
   }

   public async getChatter(peerId: number): Promise<Chatter | null> {
      return new Promise<Chatter | null>((resolve) => {
         this._client.roomSocket.emit(
            'getChatterProfile',
            peerId,
            (chatterProfile: ChatterProfile | null) =>
               chatterProfile
                  ? resolve(new Chatter(chatterProfile, this._client))
                  : null
         );
      });
   }

   public quit(): void {
      this._client.roomSocket.emit('forceQuit');
   }

   public joinRound(): void {
      this._client.gameSocket.emit('joinRound');
   }

   public leaveRound(): void {
      this._client.gameSocket.emit('leaveRound');
   }

   public startRound(): void {
      this._client.gameSocket.emit('startRoundNow');
   }

   public sendMessage(
      content: string,
      variant: MessageVariant = 'default'
   ): void {
      const variantColors: Record<MessageVariant, string> = {
         default: '#ffffff',
         danger: '#e61717',
         success: '#12c934',
         warning: '#f5a905',
         info: '#197ee3'
      };

      const contentChunks = content.match(/(.|\n){1,300}/g);

      for (const chunk of contentChunks) {
         this._client.roomSocket.emit('chat', chunk, {
            color: variantColors[variant]
         });
      }
   }

   public setPublic(isPublic: boolean): void {
      this._client.roomSocket.emit('setRoomPublic', isPublic);
   }

   public lockRules(): void {
      this._client.gameSocket.emit('setRulesLocked', true);
   }

   public unlockRules(): void {
      this._client.gameSocket.emit('setRulesLocked', false);
   }

   public setCustomRules(rules: Optional<Rules>): void {
      this.unlockRules();
      this._client.gameSocket.emit('setRules', rules);
      this.lockRules();
   }

   public resetRules(): void {
      this.setCustomRules(DEFAULT_RULES);
   }

   public setMode(mode: Mode): void {
      this.mode = mode;
      this.setCustomRules(MODE_RULES[mode]);
   }

   public setGame(gameId: GameId): void {
      this._client.roomSocket.emit('setGame', gameId);
   }
}
