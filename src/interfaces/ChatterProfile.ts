import type { ChatterRole } from '../types';
import type { Auth } from '.';

export interface ChatterProfile {
   auth: Auth | null;
   nickname: string;
   peerId: number;
   roles: ChatterRole[];
   picture?: string;
   language?: string;
}
