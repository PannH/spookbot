import { type Chatter, Event } from '../../classes';

export default new Event(
   {
      name: 'chat'
   },
   (client, chatter: Chatter, content: string) => {
      console.log(`${chatter.nickname} says "${content}"`);
   }
);
