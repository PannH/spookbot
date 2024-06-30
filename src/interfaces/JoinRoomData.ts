import type { Role } from '../types';
import type { RoomEntry } from '.';

export default interface JoinRoomData {
   roomEntry: RoomEntry;
   selfPeerId: number;
   selfRoles: Role[];
   scripts: null | any;
}
