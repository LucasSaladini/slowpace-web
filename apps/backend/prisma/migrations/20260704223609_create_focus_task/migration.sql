-- CreateTable
CREATE TABLE "focus_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isBacklog" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "focus_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "focus_tasks_userId_isCompleted_isBacklog_idx" ON "focus_tasks"("userId", "isCompleted", "isBacklog");

-- AddForeignKey
ALTER TABLE "focus_tasks" ADD CONSTRAINT "focus_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
