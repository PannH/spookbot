import { Command } from '../classes';

export default new Command(
   {
      name: 'version',
      aliases: ['v'],
      description: 'Voir la version actuelle du bot.',
      usageFormats: ['/version']
   },
   async (client, message) => {
      const version: string = require('../../package.json').version;

      client.room.sendMessage(
         `Version actuelle: v${version}\n\nVoir les mises à jour récentes: https://dsc.gg/spookbot`
      );
   }
);
