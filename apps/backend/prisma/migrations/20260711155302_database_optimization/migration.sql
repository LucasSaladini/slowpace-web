/*
  Warnings:

  - You are about to drop the `Hobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hobby" DROP CONSTRAINT "Hobby_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_hobbyId_fkey";

-- DropTable
DROP TABLE "Hobby";

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "hobbies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "hobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hobbyId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hobbies_userId_createdAt_idx" ON "hobbies"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "sessions_hobbyId_createdAt_idx" ON "sessions"("hobbyId", "createdAt");

-- AddForeignKey
ALTER TABLE "hobbies" ADD CONSTRAINT "hobbies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "hobbies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
