import type {
   Profile,
   ActiveRoom,
   Record,
   Word,
   Blacklist
} from '@prisma/client';
import type { Mode, ProfileRole, RecordCategory, WordCategory } from '../types';
import { prisma } from '../globals';
import { STAT_NAME } from '../constants';
import { randomBytes } from 'node:crypto';

export async function getWords(): Promise<
   { value: string; categories: WordCategory[]; isTested: boolean }[]
> {
   const words = await prisma.word.findMany({
      select: {
         value: true,
         categories: true,
         isTested: true
      }
   });

   return words as {
      value: string;
      categories: WordCategory[];
      isTested: boolean;
   }[];
}

export async function setWordTestedState(
   word: string,
   isTested: boolean
): Promise<void> {
   await prisma.word.update({
      where: { value: word },
      data: { isTested }
   });
}

export async function getWordCategories(word: string): Promise<WordCategory[]> {
   const foundWord = await prisma.word.findUnique({
      select: {
         categories: true
      },
      where: {
         value: word
      }
   });

   return (foundWord?.categories ?? []) as WordCategory[];
}

export async function createWords(data: Omit<Word, 'id'>[]): Promise<void> {
   await prisma.word.createMany({ data });
}

export async function deleteWords(words: string[]): Promise<void> {
   await prisma.word.deleteMany({
      where: {
         value: {
            in: words
         }
      }
   });
}

export async function getProfileByAuthId(
   authId: string
): Promise<(Profile & { roles: ProfileRole[] }) | null> {
   return (await prisma.profile.findUnique({
      where: {
         authId: authId ?? ''
      }
   })) as any;
}

export async function getProfileById(
   id: number
): Promise<Profile & { roles: ProfileRole[] }> {
   return (await prisma.profile.findUnique({
      where: {
         id: id ?? -1
      }
   })) as any;
}

export async function getProfileByNickname(
   nickname: string
): Promise<Profile & { roles: ProfileRole[] }> {
   return (await prisma.profile.findUnique({
      where: {
         nickname
      }
   })) as any;
}

export async function getProfileByAuthIdWithRecords(
   authId: string,
   mode: Mode
): Promise<Profile & { roles: ProfileRole[]; records: Record[] }> {
   return (await prisma.profile.findUnique({
      where: {
         authId
      },
      include: {
         records: {
            where: { mode }
         }
      }
   })) as any;
}

export async function getProfileByNicknameWithRecords(
   nickname: string,
   mode: Mode
): Promise<Profile & { roles: ProfileRole[]; records: Record[] }> {
   return (await prisma.profile.findUnique({
      where: {
         nickname
      },
      include: {
         records: {
            where: { mode }
         }
      }
   })) as any;
}

export async function createProfile(data: {
   authId: string;
   nickname: string;
}): Promise<Profile & { roles: ProfileRole[] }> {
   const sameUsernameProfilesCount = await prisma.profile.count({
      where: {
         nickname: data.nickname
      }
   });

   const nickname = sameUsernameProfilesCount
      ? `Joueur-${randomBytes(3).toString('hex')}`
      : data.nickname;

   return (await prisma.profile.create({
      data: {
         ...data,
         nickname
      }
   })) as any;
}

export async function updateProfileNickname(
   profileId: number,
   nickname: string
) {
   await prisma.profile.update({
      where: { id: profileId },
      data: { nickname }
   });
}

export async function getProfilesCount(): Promise<number> {
   return await prisma.profile.count();
}

export async function getEconomyProfiles(pageIndex = 0): Promise<Profile[]> {
   return await prisma.profile.findMany({
      orderBy: {
         coins: 'desc'
      },
      take: 10,
      skip: pageIndex * 10
   });
}

export async function getRecordsByProfileId(
   profileId: number,
   mode: Mode
): Promise<Record[]> {
   return await prisma.record.findMany({
      where: { profileId, mode }
   });
}

export async function getLeadRecords(
   mode: Mode
): Promise<(Record & { Profile: Profile })[]> {
   return await Promise.all(
      Object.keys(STAT_NAME).map((key) =>
         prisma.record.findFirst({
            where: { key, mode },
            orderBy: {
               value: 'desc'
            },
            include: {
               Profile: true
            },
            take: 1
         })
      )
   );
}

export async function getLeadCategoryRecords(
   category: RecordCategory,
   mode: Mode,
   pageIndex = 0
): Promise<(Record & { Profile: Profile })[]> {
   return await prisma.record.findMany({
      where: {
         key: category,
         mode
      },
      include: {
         Profile: true
      },
      orderBy: {
         value: 'desc'
      },
      take: 10,
      skip: pageIndex * 10
   });
}

export async function getLeadCategoryRecordsCount(
   category: RecordCategory,
   mode: Mode
): Promise<number> {
   return await prisma.record.count({
      where: {
         key: category,
         mode
      }
   });
}

export async function getActiveRooms(): Promise<ActiveRoom[]> {
   return await prisma.activeRoom.findMany();
}

export async function getDefaultActiveRoom(): Promise<ActiveRoom> {
   return await prisma.activeRoom.findFirst({
      where: {
         isDefault: true
      }
   });
}

export async function getActiveRoomByOwnerAuthId(
   ownerAuthId: string
): Promise<ActiveRoom> {
   return await prisma.activeRoom.findFirst({
      where: {
         ownerAuthId
      }
   });
}

export async function getActiveRoomByCode(
   code: string
): Promise<ActiveRoom | null> {
   return await prisma.activeRoom.findUnique({
      where: { code }
   });
}

export async function createActiveRoom(
   data: Omit<ActiveRoom, 'id'>
): Promise<void> {
   await prisma.activeRoom.create({ data });
}

export async function deleteRoomsByCode(codes: string[]): Promise<void> {
   await prisma.activeRoom.deleteMany({
      where: {
         code: {
            in: codes
         }
      }
   });
}

export async function deleteRoomByCode(code: string): Promise<void> {
   await prisma.activeRoom.delete({
      where: { code }
   });
}

export async function blacklistUser(
   authId: string,
   reason: string
): Promise<void> {
   await prisma.blacklist.create({
      data: { authId, reason }
   });
}

export async function unblacklistUser(authId: string): Promise<void> {
   await prisma.blacklist.delete({
      where: { authId }
   });
}

export async function getBlacklistUser(authId: string): Promise<Blacklist> {
   return await prisma.blacklist.findUnique({
      where: { authId: authId ?? '' }
   });
}

export async function getBlacklist(): Promise<Blacklist[]> {
   return await prisma.blacklist.findMany();
}
