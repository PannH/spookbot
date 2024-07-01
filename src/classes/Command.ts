import type { CommandOptions } from '../interfaces';
import type { CommandCallback } from '../types';

export default class Command {
   constructor(
      public readonly options: CommandOptions,
      public readonly callback: CommandCallback
   ) {}
}
