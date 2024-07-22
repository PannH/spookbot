import type { Client } from '.';
import type { Awaitable } from '../types';

type EventCallback = (client: Client, ...args: any[]) => Awaitable<void>;

export class Event {
   constructor(
      public readonly name: string,
      public readonly callback: EventCallback
   ) {}
}
