-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "fio" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "city" VARCHAR(64) NOT NULL,
    "community" VARCHAR(128) NOT NULL,
    "room" INTEGER,
    "refresh" VARCHAR(256),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
