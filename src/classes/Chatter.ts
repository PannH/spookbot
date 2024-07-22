import type { ChatterProfile } from '../interfaces';
import type { Client } from '.';
import type { ChatterRole } from '../types';

export class Chatter {
   constructor(
      public readonly profile: ChatterProfile,
      protected readonly _client: Client
   ) {}

   public async setModerator(isModerator: boolean): Promise<void> {
      return new Promise((resolve, reject) => {
         this._client.roomSocket.emit(
            'setUserModerator',
            this.profile.peerId,
            isModerator,
            (response: { roles: ChatterRole[] } | { errorCode: string }) => {
               if ('errorCode' in response) return reject(response.errorCode);

               this.profile.roles = response.roles;

               resolve();
            }
         );
      });
   }

   public ban(): void {
      this._client.roomSocket.emit('setUserBanned', this.profile.peerId, true);
   }

   public unban(): void {
      this._client.roomSocket.emit('setUserBanned', this.profile.peerId, false);
   }

   public softBan(): void {
      this.ban();
      this.unban();
   }
}
