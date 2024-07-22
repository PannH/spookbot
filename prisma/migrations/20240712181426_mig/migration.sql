-- CreateTable
CREATE TABLE `active_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_auth_id` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `active_rooms_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
