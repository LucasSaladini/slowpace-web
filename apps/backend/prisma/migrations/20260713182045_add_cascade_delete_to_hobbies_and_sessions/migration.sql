-- DropForeignKey
ALTER TABLE "hobbies" DROP CONSTRAINT "hobbies_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_hobbyId_fkey";

-- AddForeignKey
ALTER TABLE "hobbies" ADD CONSTRAINT "hobbies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "hobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
