import type { EventOptions } from '../interfaces';
import type { EventCallback } from '../types';

export default class ClientEvent {
   constructor(
      public readonly options: EventOptions,
      public readonly callback: EventCallback
   ) {}
}
