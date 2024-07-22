-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `auth_id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,

    UNIQUE INDEX `profiles_auth_id_key`(`auth_id`),
    UNIQUE INDEX `profiles_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
