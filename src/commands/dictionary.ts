import { Command } from '../classes';
import deburr from 'lodash/deburr';
import { dictionary } from '../globals';
import verbsConjugations from 'french-verbs-lefff/dist/conjugations.json';
import { removeDuplicates } from '../functions';

type Subcommand = 'add' | 'remove' | 'conjug';

export default new Command(
   {
      name: 'dictionary',
      aliases: ['dict'],
      description: 'Gérer le dictionnaire.',
      usageFormats: [
         '/dict add [mot1] [mot2] [...]',
         '/dict remove [mot1] [mot2] [...]',
         '/dict conjug [verbe]'
      ],
      usageExamples: [
         '/dict add hippoboscide hippoboscides',
         '/dict remove samsung',
         '/dict conjug annihiler'
      ],
      dictionaryManagerOnly: true
   },
   (client, message) => {
      const subcommand = message.args.shift() as Subcommand;

      const SUBCOMMANDS: Subcommand[] = ['add', 'remove', 'conjug'];

      if (!subcommand || !SUBCOMMANDS.includes(subcommand))
         return client.room.sendMessage(
            `Veuillez choisir parmi ces sous-commandes: ${SUBCOMMANDS.join(', ')}.`,
            'danger'
         );

      if (!message.args.length)
         return client.room.sendMessage(
            'Veuillez spécifier au moins un mot.',
            'danger'
         );

      switch (subcommand) {
         case 'add': {
            const words = removeDuplicates(
               message.args.map((arg) => deburr(arg.toLowerCase()))
            );
            const unknownWords = words.filter(
               (word) => !dictionary.hasWord(word)
            );

            if (!unknownWords.length)
               return client.room.sendMessage(
                  'Tous ces mots sont déjà dans le dictionnaire.',
                  'danger'
               );

            dictionary.addWords(unknownWords, message.chatter.profile.auth?.id);

            client.room.sendMessage(
               `[+] ${unknownWords.map((w) => w.toUpperCase()).join(', ')}`,
               'success'
            );

            break;
         }

         case 'remove': {
            const words = removeDuplicates(
               message.args.map((arg) => deburr(arg.toLowerCase()))
            );
            const knownWords = words.filter((word) => dictionary.hasWord(word));

            if (!knownWords.length)
               return client.room.sendMessage(
                  "Aucun de ces mots n'est dans le dictionnaire.",
                  'danger'
               );

            dictionary.removeWords(
               knownWords,
               message.chatter.profile.auth?.id
            );

            client.room.sendMessage(
               `[-] ${knownWords.map((w) => w.toUpperCase()).join(', ')}`,
               'danger'
            );

            break;
         }

         case 'conjug': {
            if (message.args.length > 1)
               return client.room.sendMessage(
                  "Veuillez ne spécifier qu'un seul verbe.",
                  'danger'
               );

            const verb = message.args[0].toLowerCase();
            const rawConjugations = verbsConjugations[verb];

            if (!rawConjugations)
               return client.room.sendMessage(
                  "Ce verbe n'est pas dans le dictionnaire de conjugaison, n'oubliez pas les accents du mot et l'infinitif.",
                  'danger'
               );

            const conjugations = removeDuplicates(
               Object.values(verbsConjugations[verb] as string[][]).flat()
            )
               .filter((c) => c !== 'NA')
               .map((c) => deburr(c));

            const unknownConjugations = conjugations.filter(
               (c) => !dictionary.hasWord(c)
            );

            if (!unknownConjugations.length)
               return client.room.sendMessage(
                  'Toutes les conjugaisons de ce verbe sont déjà dans le dictionnaire.',
                  'danger'
               );

            dictionary
               .addWords(unknownConjugations, message.chatter.profile.auth?.id)
               .catch(() => {});

            client.room.sendMessage(
               `[+] ${unknownConjugations.map((c) => c.toUpperCase()).join(', ')}`,
               'success'
            );

            break;
         }
      }
   }
);
