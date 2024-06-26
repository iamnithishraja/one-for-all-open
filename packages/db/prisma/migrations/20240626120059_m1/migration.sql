/*
  Warnings:

  - You are about to drop the column `MCQQuestionId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `problemStatementId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `quizScoreId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `inputs` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the `TrackProblems` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[problemId]` on the table `MCQQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[problemId]` on the table `ProblemStatement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[problemId]` on the table `QuizScore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expectedOutput` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_MCQQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_problemStatementId_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_quizScoreId_fkey";

-- DropForeignKey
ALTER TABLE "TrackProblems" DROP CONSTRAINT "TrackProblems_problemId_fkey";

-- DropForeignKey
ALTER TABLE "TrackProblems" DROP CONSTRAINT "TrackProblems_trackId_fkey";

-- DropIndex
DROP INDEX "Problem_MCQQuestionId_key";

-- DropIndex
DROP INDEX "Problem_problemStatementId_key";

-- DropIndex
DROP INDEX "Problem_quizScoreId_key";

-- AlterTable
ALTER TABLE "MCQQuestion" ALTER COLUMN "problemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "MCQQuestionId",
DROP COLUMN "problemStatementId",
DROP COLUMN "quizScoreId",
ADD COLUMN     "sortingOrder" INTEGER,
ADD COLUMN     "trackId" TEXT;

-- AlterTable
ALTER TABLE "ProblemStatement" ADD COLUMN     "problemId" TEXT;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "inputs",
ADD COLUMN     "expectedOutput" TEXT NOT NULL,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "input" TEXT NOT NULL;

-- DropTable
DROP TABLE "TrackProblems";

-- CreateIndex
CREATE UNIQUE INDEX "MCQQuestion_problemId_key" ON "MCQQuestion"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_trackId_key" ON "Problem"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStatement_problemId_key" ON "ProblemStatement"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizScore_problemId_key" ON "QuizScore"("problemId");

-- AddForeignKey
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizScore" ADD CONSTRAINT "QuizScore_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
