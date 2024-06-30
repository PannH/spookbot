import type { Role } from '../types';
import type { Auth } from '.';

export default interface ChatterProfileData {
   auth: Auth | null;
   nickname: string;
   peerId: number;
   roles: Role[];
   picture?: string;
   language?: string;
}
