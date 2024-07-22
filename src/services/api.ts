import Axios from 'axios';

import type { RoomEntry } from '../interfaces';
import type { GameId } from '../types';

const axios = Axios.create({
   baseURL: process.env.BASE_API_URL
});

interface RoomsResponse {
   publicRooms: RoomEntry[];
   stats: {
      rooms: number;
      playerCount: number;
   };
}
export async function getRooms(): Promise<RoomEntry[]> {
   const response = await axios.get<RoomsResponse>('/rooms');

   return response.data.publicRooms;
}

interface CreateRoomData {
   creatorUserToken: string;
   gameId: GameId;
   name: string;
   isPublic: boolean;
}

interface CreateRoomResponse {
   url: string;
   roomCode: string;
}

export async function createRoom(data: CreateRoomData): Promise<string> {
   const response = await axios.post<CreateRoomResponse>('/startRoom', data);

   return response.data.roomCode;
}

interface JoinRoomResponse {
   url: string;
}
export async function joinRoom(roomCode: string): Promise<string> {
   const response = await axios.post<JoinRoomResponse>('/joinRoom', {
      roomCode
   });

   return response.data.url;
}
