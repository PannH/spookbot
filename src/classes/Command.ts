import type CommandOptions from '../interfaces/CommandOptions';
import type { CommandCallback } from '../types';

export default class Command {
   constructor(
      public readonly options: CommandOptions,
      public readonly callback: CommandCallback
   ) {}
}
