import type { Chatter, Client } from '.';

export default class Message {
   constructor(
      public readonly chatter: Chatter,
      public readonly content: string,
      private readonly _client: Client
   ) {}
}
