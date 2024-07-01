import type { ChatterProfileData } from '../interfaces';
import type { Role } from '../types';
import type { Client } from '.';

export default class Chatter {
   public authId: string | null;
   public nickname: string;
   public peerId: number;
   public roles: Role[];

   constructor(
      data: ChatterProfileData,
      private _client: Client
   ) {
      const { auth, nickname, peerId, roles } = data;

      this.authId = auth?.id ?? null;
      this.nickname = nickname;
      this.peerId = peerId;
      this.roles = roles;
   }

   public get isModerator(): boolean {
      return this.roles.includes('moderator');
   }

   public async setModerator(isModerator: boolean): Promise<void> {
      return new Promise((resolve, reject) => {
         this._client.roomSocket.emit(
            'setUserModerator',
            this.peerId,
            isModerator,
            (response: { roles: Role[] } | { errorCode: string }) => {
               if ('errorCode' in response) return reject(response.errorCode);

               this.roles = response.roles;

               resolve();
            }
         );
      });
   }

   public ban(): void {
      this._client.roomSocket.emit('setUserBanned', this.peerId, true);
   }

   public unban(): void {
      this._client.roomSocket.emit('setUserBanned', this.peerId, false);
   }

   public softBan(): void {
      this.ban();
      this.unban();
   }
}
