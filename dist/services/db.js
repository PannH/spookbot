"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWords = getWords;
exports.getWordCategories = getWordCategories;
exports.createWords = createWords;
exports.deleteWords = deleteWords;
exports.getProfileByAuthId = getProfileByAuthId;
exports.getProfileById = getProfileById;
exports.getProfileByNickname = getProfileByNickname;
exports.getProfileByAuthIdWithRecords = getProfileByAuthIdWithRecords;
exports.getProfileByNicknameWithRecords = getProfileByNicknameWithRecords;
exports.createProfile = createProfile;
exports.updateProfileNickname = updateProfileNickname;
exports.getProfilesCount = getProfilesCount;
exports.getEconomyProfiles = getEconomyProfiles;
exports.getRecordsByProfileId = getRecordsByProfileId;
exports.getLeadRecords = getLeadRecords;
exports.getLeadCategoryRecords = getLeadCategoryRecords;
exports.getLeadCategoryRecordsCount = getLeadCategoryRecordsCount;
exports.getActiveRooms = getActiveRooms;
exports.getDefaultActiveRoom = getDefaultActiveRoom;
exports.getActiveRoomByOwnerAuthId = getActiveRoomByOwnerAuthId;
exports.getActiveRoomByCode = getActiveRoomByCode;
exports.createActiveRoom = createActiveRoom;
exports.deleteRoomsByCode = deleteRoomsByCode;
exports.deleteRoomByCode = deleteRoomByCode;
const globals_1 = require("../globals");
const constants_1 = require("../constants");
const node_crypto_1 = require("node:crypto");
async function getWords() {
    const words = await globals_1.prisma.word.findMany({
        select: {
            value: true,
            categories: true
        }
    });
    return words;
}
async function getWordCategories(word) {
    const foundWord = await globals_1.prisma.word.findUnique({
        select: {
            categories: true
        },
        where: {
            value: word
        }
    });
    return (foundWord?.categories ?? []);
}
async function createWords(data) {
    await globals_1.prisma.word.createMany({ data });
}
async function deleteWords(words) {
    await globals_1.prisma.word.deleteMany({
        where: {
            value: {
                in: words
            }
        }
    });
}
async function getProfileByAuthId(authId) {
    return (await globals_1.prisma.profile.findUnique({
        where: {
            authId: authId ?? ''
        }
    }));
}
async function getProfileById(id) {
    return (await globals_1.prisma.profile.findUnique({
        where: {
            id: id ?? -1
        }
    }));
}
async function getProfileByNickname(nickname) {
    return (await globals_1.prisma.profile.findUnique({
        where: {
            nickname
        }
    }));
}
async function getProfileByAuthIdWithRecords(authId, mode) {
    return (await globals_1.prisma.profile.findUnique({
        where: {
            authId
        },
        include: {
            records: {
                where: { mode }
            }
        }
    }));
}
async function getProfileByNicknameWithRecords(nickname, mode) {
    return (await globals_1.prisma.profile.findUnique({
        where: {
            nickname
        },
        include: {
            records: {
                where: { mode }
            }
        }
    }));
}
async function createProfile(data) {
    const sameUsernameProfilesCount = await globals_1.prisma.profile.count({
        where: {
            nickname: data.nickname
        }
    });
    const nickname = sameUsernameProfilesCount
        ? `Joueur-${(0, node_crypto_1.randomBytes)(3).toString('hex')}`
        : data.nickname;
    return (await globals_1.prisma.profile.create({
        data: {
            ...data,
            nickname
        }
    }));
}
async function updateProfileNickname(profileId, nickname) {
    await globals_1.prisma.profile.update({
        where: { id: profileId },
        data: { nickname }
    });
}
async function getProfilesCount() {
    return await globals_1.prisma.profile.count();
}
async function getEconomyProfiles(pageIndex = 0) {
    return await globals_1.prisma.profile.findMany({
        orderBy: {
            coins: 'desc'
        },
        take: 10,
        skip: pageIndex * 10
    });
}
async function getRecordsByProfileId(profileId, mode) {
    return await globals_1.prisma.record.findMany({
        where: { profileId, mode }
    });
}
async function getLeadRecords(mode) {
    return await Promise.all(Object.keys(constants_1.STAT_NAME).map((key) => globals_1.prisma.record.findFirst({
        where: { key, mode },
        orderBy: {
            value: 'desc'
        },
        include: {
            Profile: true
        },
        take: 1
    })));
}
async function getLeadCategoryRecords(category, mode, pageIndex = 0) {
    return await globals_1.prisma.record.findMany({
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
async function getLeadCategoryRecordsCount(category, mode) {
    return await globals_1.prisma.record.count({
        where: {
            key: category,
            mode
        }
    });
}
async function getActiveRooms() {
    return await globals_1.prisma.activeRoom.findMany();
}
async function getDefaultActiveRoom() {
    return await globals_1.prisma.activeRoom.findFirst({
        where: {
            isDefault: false
        }
    });
}
async function getActiveRoomByOwnerAuthId(ownerAuthId) {
    return await globals_1.prisma.activeRoom.findFirst({
        where: {
            ownerAuthId
        }
    });
}
async function getActiveRoomByCode(code) {
    return await globals_1.prisma.activeRoom.findUnique({
        where: { code }
    });
}
async function createActiveRoom(data) {
    await globals_1.prisma.activeRoom.create({ data });
}
async function deleteRoomsByCode(codes) {
    await globals_1.prisma.activeRoom.deleteMany({
        where: {
            code: {
                in: codes
            }
        }
    });
}
async function deleteRoomByCode(code) {
    await globals_1.prisma.activeRoom.delete({
        where: { code }
    });
}
