/*
  Warnings:

  - A unique constraint covering the columns `[room]` on the table `Ad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ad_room_key" ON "Ad"("room");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_room_key" ON "Topic"("room");
