import { joinRoom } from '../services/api';
import { readdirSync } from 'node:fs';
import { relative } from 'node:path';
import { EventEmitter } from 'node:stream';
import { Room, type Event } from '.';
import io, { type Socket } from 'socket.io-client';
import type { RoomData } from '../interfaces';

type EventDir = 'game' | 'room' | 'client';

export class Client extends EventEmitter {
   public gameSocket: Socket | null = null;
   public roomSocket: Socket | null = null;
   public room: Room | null = null;

   constructor(
      public readonly nickname: string = process.env.DEFAULT_CLIENT_NICKNAME,
      public readonly picture: string = process.env.DEFAULT_CLIENT_PICTURE,
      deadInstance?: Client
   ) {
      super();

      if (deadInstance) this.room = deadInstance.room;
   }

   private _initEvents(): void {
      const eventsPath = __dirname.replace('classes', 'events');

      for (const subDir of readdirSync(eventsPath) as EventDir[]) {
         for (const file of readdirSync(`${eventsPath}/${subDir}`)) {
            const event: Event = require(
               relative(__dirname, `${eventsPath}/${subDir}/${file}`)
            ).default;
            const callbackBind = event.callback.bind(null, this);

            switch (subDir) {
               case 'game':
                  this.gameSocket.on(event.name, callbackBind);
                  break;

               case 'room':
                  this.roomSocket.on(event.name, callbackBind);
                  break;

               case 'client':
                  this.on(event.name, callbackBind);
                  break;
            }
         }
      }
   }

   public async joinRoom(
      roomCode: string,
      fromDisconnect = false
   ): Promise<void> {
      return new Promise((resolve) => {
         (async () => {
            const nodeUrl = await joinRoom(roomCode);

            const SOCKET_OPTIONS = {
               transports: ['websocket'],
               reconnection: true
            };

            this.gameSocket = io(nodeUrl, SOCKET_OPTIONS);
            this.roomSocket = io(nodeUrl, SOCKET_OPTIONS);

            this.roomSocket.once('connect', () => {
               this.roomSocket.emit(
                  'joinRoom',
                  {
                     auth: {
                        service: 'jklm',
                        token: process.env.CLIENT_TOKEN,
                        username: 'SpookBot'
                     },
                     nickname: this.nickname,
                     picture: this.picture,
                     userToken: process.env.CLIENT_USER_TOKEN,
                     roomCode
                  },
                  async (room: RoomData) => {
                     this.gameSocket.emit(
                        'joinGame',
                        room.roomEntry.gameId,
                        roomCode,
                        process.env.CLIENT_USER_TOKEN
                     );

                     if (!fromDisconnect) this.room = new Room(room, this);

                     this._initEvents();

                     resolve();
                  }
               );
            });
         })();
      });
   }
}
