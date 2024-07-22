import type { ChatterRole } from '../types';
import type { RoomEntry } from '.';

export interface RoomData {
   roomEntry: RoomEntry;
   selfPeerId: number;
   selfRoles: ChatterRole[];
   scripts: null | any;
}
