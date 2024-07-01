import type { Client } from '../classes';
import type { Awaitable } from './Awaitable';

export type EventCallback = (client: Client, ...args: any[]) => Awaitable<void>;
