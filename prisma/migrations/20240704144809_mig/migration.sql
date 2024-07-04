/*
  Warnings:

  - You are about to drop the column `is_default` on the `active_rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `active_rooms` DROP COLUMN `is_default`,
    ADD COLUMN `isDefault` BOOLEAN NOT NULL DEFAULT false;
