import type { ChatterProfileData } from '../interfaces';
import type { Role } from '../types';
import type { Client } from '.';
import type { Profile } from '@prisma/client';
import globals from '../globals';
import { randomBytes } from 'node:crypto';
import constants from '../constants';

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

   public async getProfile(): Promise<Profile | null> {
      if (!this.authId) return null;

      return await globals.prisma.profile.findUnique({
         where: {
            authId: this.authId
         }
      });
   }

   public async createProfile(): Promise<Profile> {
      const sameUsernameProfile = await globals.prisma.profile.findUnique({
         where: {
            username: this.nickname
         }
      });

      await globals.prisma.profile.create({
         data: {
            authId: this.authId,
            username: sameUsernameProfile
               ? `Joueur-${randomBytes(3).toString('hex')}`
               : this.nickname
         }
      });

      for (const modeKey of Object.keys(constants.MODE_RULES)) {
         for (const statKey of Object.keys(constants.DEFAULT_PLAYER_STATS)) {
            await globals.prisma.record.create({
               data: {
                  key: statKey,
                  mode: modeKey,
                  profileId: (await this.getProfile()).id
               }
            });
         }
      }

      return await this.getProfile();
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
