import axios from 'axios';
import { Command } from '../classes';
import { SHOP_ITEMS } from '../constants';
import {
   buyShopItem,
   decrementProfileCoins,
   getProfileByAuthId,
   getProfileShopItem,
   getProfileShopItems,
   incrementProfileCoins,
   sellShopItem,
   updateShopItemValue
} from '../services/db';
import Jimp from 'jimp';

export default new Command(
   {
      name: 'shop',
      description: 'Accéder au shop.',
      usageFormats: [
         '/shop',
         '/shop buy [id item]',
         '/shop sell [id item]',
         '/shop custom [id item] [valeur]'
      ],
      usageExamples: [
         '/shop',
         '/shop buy 1',
         '/shop sell 1',
         '/shop custom 1 MyBot'
      ],
      requireAuth: true
   },
   async (client, message) => {
      const subcommand = message.args[0];

      if (subcommand) {
         switch (subcommand) {
            case 'buy': {
               const itemId = message.args[1];

               if (!itemId)
                  return client.room.sendMessage(
                     "Veuillez spécifier l'id de l'item à acheter.",
                     'danger'
                  );

               const item = SHOP_ITEMS.find(
                  (item) => item.id === Number.parseInt(itemId)
               );

               if (!item)
                  return client.room.sendMessage(
                     `Aucun item ne correspond à l'id spécifié, veuillez choisir parmi: ${SHOP_ITEMS.map((item) => `${item.id} (${item.name})`).join(', ')}.`,
                     'danger'
                  );

               const profile = await getProfileByAuthId(
                  message.chatter.profile.auth?.id
               );
               const shopItem = await getProfileShopItem(profile.id, item.id);

               if (shopItem)
                  return client.room.sendMessage(
                     `Vous possédez déjà l'item "${item.name}", pour le racheter à nouveau veuillez d'abord le vendre en utilisant "/shop sell ${item.id} -yes".`,
                     'danger'
                  );

               if (profile.coins < item.price)
                  return client.room.sendMessage(
                     `Vous n'avez pas assez de pièces pour cet item, il vous manque ${item.price - profile.coins} 🪙.`,
                     'danger'
                  );

               const isSure = message.flags.includes('-yes');

               if (!isSure)
                  return client.room.sendMessage(
                     `Vous êtes sur le point d'acheter l'item "${item.name}" pour ${item.price} 🪙, pour confirmer veuillez retaper la commande en utilisant le paramètre "-yes".`,
                     'warning'
                  );

               await decrementProfileCoins(profile.authId, item.price);

               await buyShopItem(profile.id, item.id);

               client.room.sendMessage(
                  `Vous avez acheté l'item "${item.name}", utilisez "/shop custom ${item.id} [...]" pour le personnaliser. Attention: vous ne pouvez le personnaliser qu'une fois, vous devrez ensuite le racheter.`
               );

               break;
            }

            case 'sell': {
               const itemId = message.args[1];

               if (!itemId)
                  return client.room.sendMessage(
                     "Veuillez spécifier l'id de l'item à vendre.",
                     'danger'
                  );

               const item = SHOP_ITEMS.find(
                  (item) => item.id === Number.parseInt(itemId)
               );

               if (!item)
                  return client.room.sendMessage(
                     `Aucun item ne correspond à l'id spécifié, veuillez choisir parmi: ${SHOP_ITEMS.map((item) => `${item.id} (${item.name})`).join(', ')}.`,
                     'danger'
                  );

               const profile = await getProfileByAuthId(
                  message.chatter.profile.auth?.id
               );
               const shopItem = await getProfileShopItem(profile.id, item.id);

               if (!shopItem)
                  return client.room.sendMessage(
                     `Vous ne possédez pas l'item "${item.name}".`,
                     'danger'
                  );

               const isSure = message.flags.includes('-yes');
               const sellPrice = item.price / 2;

               if (!isSure)
                  return client.room.sendMessage(
                     `Vous êtes sur le point de vendre l'item "${item.name}" pour ${sellPrice} 🪙 (moitié du prix d'achat), pour confirmer veuillez retaper la commande en utilisant le paramètre "-yes".`,
                     'warning'
                  );

               await sellShopItem(profile.id, item.id);

               await incrementProfileCoins(profile.authId, sellPrice);

               client.room.sendMessage(
                  `Vous avez vendu l'item "${item.name}" pour ${sellPrice} 🪙.`
               );

               break;
            }

            case 'custom': {
               const itemId = message.args[1];

               if (!itemId)
                  return client.room.sendMessage(
                     "Veuillez spécifier l'id de l'item à personnaliser.",
                     'danger'
                  );

               const item = SHOP_ITEMS.find(
                  (item) => item.id === Number.parseInt(itemId)
               );

               if (!item)
                  return client.room.sendMessage(
                     `Aucun item ne correspond à l'id spécifié, veuillez choisir parmi: ${SHOP_ITEMS.map((item) => `${item.id} (${item.name})`).join(', ')}.`,
                     'danger'
                  );

               const profile = await getProfileByAuthId(
                  message.chatter.profile.auth?.id
               );
               const shopItem = await getProfileShopItem(profile.id, item.id);

               if (!shopItem)
                  return client.room.sendMessage(
                     `Vous ne possédez pas l'item "${item.name}", veuillez d'abord l'acheter en utilisant "/shop buy ${item.id}".`,
                     'danger'
                  );

               if (shopItem.value)
                  return client.room.sendMessage(
                     `Vous avez déjà personnalisé l'item "${item.name}", vous devez le racheter pour pouvoir le modifier.`,
                     'danger'
                  );

               const value = message.args.slice(2).join(' ');

               if (value === '')
                  return client.room.sendMessage(
                     "Veuillez spécifier une valeur pour personnaliser l'item.",
                     'danger'
                  );

               let processedValue: string;
               switch (item.id) {
                  case 1: {
                     if (value.length < 2 || value.length > 30)
                        return client.room.sendMessage(
                           'Le pseudo doit contenir entre 2 et 30 caractères.',
                           'danger'
                        );

                     processedValue = value;

                     break;
                  }

                  case 2: {
                     if (!/^https?:\/\/.+/.test(value))
                        return client.room.sendMessage(
                           "L'avatar doit être une URL d'image valide.",
                           'danger'
                        );

                     try {
                        const response = await axios.get(value, {
                           responseType: 'arraybuffer'
                        });

                        if (
                           !/^image\/(png|jfif|pjpeg|jpeg|pjp|jpg)$/.test(
                              response.headers['content-type'].toString()
                           )
                        )
                           return client.room.sendMessage(
                              'Veuillez fournir une image de type PNG, JFIF, PJPEG, JPEG, PJP, ou JPG.',
                              'danger'
                           );

                        const binaryBuffer = Buffer.from(
                           response.data,
                           'binary'
                        );

                        const image = await Jimp.read(binaryBuffer);

                        image.resize(64, 64);

                        const base64Url = await image.getBase64Async(
                           Jimp.MIME_JPEG
                        );
                        processedValue = base64Url.substring(23);
                     } catch (error) {
                        return client.room.sendMessage(
                           "Veuillez fournir un lien d'image valide.",
                           'danger'
                        );
                     }

                     break;
                  }

                  case 3: {
                     if (!/^#[0-9A-F]{6}$/i.test(value))
                        return client.room.sendMessage(
                           'La couleur doit être au format hexadécimal (ex: #e5760d).',
                           'danger'
                        );

                     processedValue = value;

                     break;
                  }

                  case 4: {
                     if (value.length < 10 || value.length > 100)
                        return client.room.sendMessage(
                           'Le message doit contenir entre 10 et 100 caractères.',
                           'danger'
                        );

                     processedValue = value;

                     break;
                  }

                  case 5: {
                     if (value.length < 2 || value.length > 30)
                        return client.room.sendMessage(
                           'Le nom de salle doit contenir entre 2 et 30 caractères.',
                           'danger'
                        );

                     processedValue = value;

                     break;
                  }
               }

               const isSure = message.flags.includes('-yes');

               if (!isSure)
                  return client.room.sendMessage(
                     `Vous êtes sur le point de personnaliser l'item "${item.name}" et vous ne pourrez plus le personnaliser ensuite à moins de le racheter, pour confirmer veuillez retaper la commande en utilisant le paramètre "-yes".`,
                     'warning'
                  );

               await updateShopItemValue(profile.id, item.id, processedValue);

               client.room.sendMessage(
                  `Vous avez personnalisé l'item "${item.name}" avec la valeur "${value}".`,
                  'success'
               );

               break;
            }

            default:
               return client.room.sendMessage(
                  'Veuillez spécifier une sous-commande valide (voir "/help shop").',
                  'danger'
               );
         }
      } else {
         const profile = await getProfileByAuthId(
            message.chatter.profile.auth?.id
         );
         const shopItems = await getProfileShopItems(profile.authId);

         client.room.sendMessage(
            `Shop:\n${SHOP_ITEMS.map((item) => `${shopItems.find((it) => it.itemId === item.id) ? '* ' : ''}[${item.id}] ${item.name} (${item.price} 🪙)`).join('\n')}\n\nVos pièces: ${profile.coins} 🪙\n* = Possédé`
         );
      }
   }
);
