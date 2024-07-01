/*
  Warnings:

  - You are about to drop the column `role` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `role`,
    ADD COLUMN `staff_role` ENUM('ADMIN', 'TRUSTED', 'DICTIONARY_MANAGER') NULL;
