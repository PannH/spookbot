import type { ChatMode, GameId } from '../types';

export default interface RoomEntry {
   roomCode: string;
   name: string;
   isPublic: boolean;
   gameId: GameId;
   playerCount: number;
   chatMode: ChatMode;
   beta: null | any;
}
