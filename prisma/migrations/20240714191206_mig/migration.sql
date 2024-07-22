/*
  Warnings:

  - You are about to drop the column `coins` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `taught_words` on the `records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `coins` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `taught_words` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `records` DROP COLUMN `coins`,
    DROP COLUMN `taught_words`;
