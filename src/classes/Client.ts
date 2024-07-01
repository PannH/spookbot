import axios from 'axios';
import io, { type Socket } from 'socket.io-client';
import { type Event, type Command, Room } from '.';
import type { CreateRoomOptions, JoinRoomData } from '../interfaces';
import EventEmitter from 'node:events';
import { readdirSync } from 'node:fs';
import globals from '../globals';

export default class Client extends EventEmitter {
   private readonly _token: string = process.env.CLIENT_TOKEN;
   private readonly _userToken: string = process.env.CLIENT_USER_TOKEN;

   public gameSocket: Socket;
   public roomSocket: Socket;
   public room: Room;
   public commands: Map<string, Command> = new Map();

   constructor(
      public nickname: string = process.env.DEFAULT_NICKNAME,
      public picture: string = process.env.DEFAULT_PICTURE
   ) {
      super();

      this._initCommands();
   }

   private _initEvents(): void {
      const socketEventFiles = readdirSync(`${globals.baseDir}/events/socket`);
      const clientEventFiles = readdirSync(`${globals.baseDir}/events/client`);

      for (const file of socketEventFiles) {
         const event: Event = require(`../events/socket/${file}`).default;
         const callbackBind = event.callback.bind(null, this);

         if (file.endsWith('.game.ts'))
            this.gameSocket[event.options.isOnce ? 'once' : 'on'](
               event.options.name,
               callbackBind
            );
         else if (file.endsWith('.room.ts'))
            this.roomSocket[event.options.isOnce ? 'once' : 'on'](
               event.options.name,
               callbackBind
            );

         console.log(`listening to ${event.options.name} (${file})`);
      }

      for (const file of clientEventFiles) {
         const event: Event = require(`../events/client/${file}`).default;
         const callbackBind = event.callback.bind(null, this);

         this[event.options.isOnce ? 'once' : 'on'](
            event.options.name,
            callbackBind
         );

         console.log(`listening to ${event.options.name} (${file})`);
      }
   }

   private _initCommands(): void {
      const commandFiles = readdirSync(`${globals.baseDir}/commands`);

      for (const file of commandFiles) {
         const command: Command = require(`../commands/${file}`).default;

         this.commands.set(command.options.name, command);
      }
   }

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
                     this._initEvents();

                     resolve();
                  }
               );
            });
         })();
      });
   }
}
