import type { Client, Message } from '.';
import type { Awaitable } from '../types';

interface MetaField {
   title: string;
   content: string;
}

interface CommandOptions {
   name: string;
   description: string;
   usageFormats: string[];
   usageExamples?: string[];
   aliases?: string[];
   inSeatingOnly?: boolean;
   requireAuth?: boolean;
   roomOwnerOnly?: boolean;
   adminOnly?: boolean;
   trustedOnly?: boolean;
   dictionaryManagerOnly?: boolean;
   metaFields?: MetaField[];
}

type CommandCallback = (client: Client, message: Message) => Awaitable<void>;

export class Command {
   constructor(
      public readonly options: CommandOptions,
      public readonly callback: CommandCallback
   ) {}
}
