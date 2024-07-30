-- CreateTable
CREATE TABLE `blacklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `auth_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blacklist_auth_id_key`(`auth_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
