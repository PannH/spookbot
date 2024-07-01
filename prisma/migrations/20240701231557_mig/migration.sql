/*
  Warnings:

  - You are about to drop the column `authId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth_id` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `profiles_authId_key` ON `profiles`;

-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `authId`,
    ADD COLUMN `auth_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profiles_auth_id_key` ON `profiles`(`auth_id`);
