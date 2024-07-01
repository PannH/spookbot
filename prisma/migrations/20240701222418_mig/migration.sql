/*
  Warnings:

  - Made the column `role` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `role` ENUM('ADMIN', 'TRUSTED', 'DICTIONARY_MANAGER') NOT NULL;
