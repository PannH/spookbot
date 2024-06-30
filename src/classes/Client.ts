import axios from 'axios';
import io, { type Socket } from 'socket.io-client';
import { randomBytes } from 'node:crypto';
import { Room } from '.';
import type { CreateRoomOptions, JoinRoomData } from '../interfaces';

export default class Client {
   private readonly _token: string = process.env.CLIENT_TOKEN;
   private readonly _userToken: string = randomBytes(8).toString('hex');

   public gameSocket: Socket;
   public roomSocket: Socket;
   public room: Room;

   constructor(
      public nickname: string = process.env.DEFAULT_NICKNAME,
      public picture: string = process.env.DEFAULT_PICTURE
   ) {}

   public async createRoom(options?: CreateRoomOptions): Promise<string> {
      const response = await axios.post<{ url: string; roomCode: string }>(
         'https://jklm.fun/api/startRoom',
         {
            creatorUserToken: this._userToken,
            gameId: 'bombparty',
            name: options?.name ?? process.env.DEFAULT_ROOM_NAME,
            isPublic: options?.isPublic ?? true
         }
      );

      return response.data.roomCode;
   }

   public async joinRoom(code: string): Promise<void> {
      return new Promise((resolve) => {
         (async () => {
            const response = await axios.post<{ url: string }>(
               'https://jklm.fun/api/joinRoom',
               {
                  roomCode: code
               }
            );

            const { url: nodeUrl } = response.data;

            const SOCKET_OPTIONS = {
               reconnection: true,
               transports: ['websocket']
            };

            this.gameSocket = io(nodeUrl, SOCKET_OPTIONS);
            this.roomSocket = io(nodeUrl, SOCKET_OPTIONS);

            this.roomSocket.once('connect', () => {
               this.roomSocket.emit(
                  'joinRoom',
                  {
                     auth: {
                        service: 'jklm',
                        token: this._token,
                        username: 'SpookBot'
                     },
                     nickname: this.nickname,
                     picture: this.picture,
                     roomCode: code,
                     userToken: this._userToken
                  },
                  (data: JoinRoomData) => {
                     const { gameId, roomCode } = data.roomEntry;

                     this.gameSocket.emit(
                        'joinGame',
                        gameId,
                        roomCode,
                        this._userToken
                     );

                     this.room = new Room(this);

                     resolve();
                  }
               );
            });
         })();
      });
   }
}
