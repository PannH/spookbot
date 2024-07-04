/*
  Warnings:

  - You are about to drop the column `auth_id` on the `active_rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_auth_id]` on the table `active_rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_auth_id` to the `active_rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `active_rooms_auth_id_key` ON `active_rooms`;

-- AlterTable
ALTER TABLE `active_rooms` DROP COLUMN `auth_id`,
    ADD COLUMN `owner_auth_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `active_rooms_owner_auth_id_key` ON `active_rooms`(`owner_auth_id`);
