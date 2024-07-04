import type { MessageVariant, NotCountStatsReason, Optional } from '../types';
import { Chatter, type Round, type Client } from '.';
import type { ChatterProfileData, JoinRoomData, Rules } from '../interfaces';
import constants from '../constants';

export default class Room {
   public selfPeerId: number;
   public code: string;
   public isPublic: boolean;
   public seatingPlayers: Chatter[] = [];
   public round: Round | null = null;
   public notCountStats: false | { reason: NotCountStatsReason } = false;

   constructor(
      public ownerAuthId: string | null,
      private _data: JoinRoomData,
      private _client: Client
   ) {
      this.selfPeerId = _data.selfPeerId;
      this.code = _data.roomEntry.roomCode;
      this.isPublic = _data.roomEntry.isPublic;
   }

   public leave(): void {
      this._client.roomSocket.emit('forceQuit');
   }

   public async getChatters(): Promise<Chatter[]> {
      return new Promise<Chatter[]>((resolve) => {
         this._client.roomSocket.emit(
            'getChatterProfiles',
            (chatterProfiles: ChatterProfileData[]) => {
               const chatters = chatterProfiles.map(
                  (chatterProfile) => new Chatter(chatterProfile, this._client)
               );

               resolve(chatters);
            }
         );
      });
   }

   public async getChatter(peerId: number): Promise<Chatter | null> {
      return new Promise<Chatter>((resolve) => {
         this._client.roomSocket.emit(
            'getChatterProfile',
            peerId,
            (chatterProfile: ChatterProfileData | null) => {
               if (!chatterProfile) return resolve(null);

               const chatter = new Chatter(chatterProfile, this._client);
               resolve(chatter);
            }
         );
      });
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
         error: '#dc2626',
         success: '#16a34a',
         warning: '#eab308',
         info: '#3b82f6'
      };

      const contentChunks = content.match(/(.|\n){1,300}/g);

      for (const chunk of contentChunks) {
         this._client.roomSocket.emit('chat', chunk, {
            color: variantColors[variant]
         });
      }
   }

   public setPrivacy(isPublic: boolean): void {
      this._client.roomSocket.emit('setRoomPublic', isPublic);
      this.isPublic = isPublic;
   }

   private _lockRules(): void {
      this._client.gameSocket.emit('setRulesLocked', true);
   }

   private _unlockRules(): void {
      this._client.gameSocket.emit('setRulesLocked', false);
   }

   public setRules(rules: Optional<Rules>): void {
      this._unlockRules();
      this._client.gameSocket.emit('setRules', rules);
      this._lockRules();
   }

   public setDefaultRules(): void {
      this.setRules(constants.DEFAULT_RULES);
   }
}
