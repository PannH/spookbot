import type { Client, Message } from '../classes';
import type { Awaitable } from './Awaitable';

export type CommandCallback = (
   client: Client,
   message: Message,
   args: string[]
) => Awaitable<void>;
