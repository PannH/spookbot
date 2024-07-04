/*
  Warnings:

  - You are about to drop the column `isDefault` on the `active_rooms` table. All the data in the column will be lost.
  - Added the required column `is_default` to the `active_rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `active_rooms` DROP COLUMN `isDefault`,
    ADD COLUMN `is_default` BOOLEAN NOT NULL;
