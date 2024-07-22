import type { Chatter, Client } from '.';

export class Message {
   public readonly rawArgs: string[];
   public readonly flags: string[];
   public readonly args: string[];

   constructor(
      public readonly content: string,
      public readonly chatter: Chatter,
      private readonly _client: Client
   ) {
      this.rawArgs = this.content.split(/ +/gm).filter((arg) => arg !== '');
      this.flags = this.rawArgs.filter((arg) => /^-.+/.test(arg));
      this.args = this.rawArgs.filter((arg) => !this.flags.includes(arg));
   }
}
