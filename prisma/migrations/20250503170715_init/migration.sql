/*
  Warnings:

  - You are about to drop the column `twitterId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Lecture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeTable" DROP CONSTRAINT "TimeTable_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "TimeTable" DROP CONSTRAINT "TimeTable_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "twitterId";

-- DropTable
DROP TABLE "Lecture";

-- DropTable
DROP TABLE "TimeTable";
