/*
  Warnings:

  - You are about to drop the `TopicUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,fio]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TopicUser" DROP CONSTRAINT "TopicUser_topicId_fkey";

-- DropForeignKey
ALTER TABLE "TopicUser" DROP CONSTRAINT "TopicUser_userId_fkey";

-- DropTable
DROP TABLE "TopicUser";

-- CreateTable
CREATE TABLE "_TopicToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TopicToUser_AB_unique" ON "_TopicToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TopicToUser_B_index" ON "_TopicToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_fio_key" ON "User"("id", "fio");

-- AddForeignKey
ALTER TABLE "_TopicToUser" ADD CONSTRAINT "_TopicToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicToUser" ADD CONSTRAINT "_TopicToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
