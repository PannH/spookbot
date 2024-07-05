/*
  Warnings:

  - Added the required column `mode` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `records` ADD COLUMN `mode` VARCHAR(191) NOT NULL;
