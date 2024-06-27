/*
  Warnings:

  - You are about to drop the column `MCQQuestionId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `problemStatementId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `quizScoreId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `boilerPlateCode` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the column `correctCode` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the column `mainCode` on the `ProblemStatement` table. All the data in the column will be lost.
  - You are about to drop the column `inputs` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `Subject` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `TrackProblems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CodeLanguageToProblemStatement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[problemId]` on the table `MCQQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[problemId]` on the table `ProblemStatement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[problemId]` on the table `QuizScore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expectedOutput` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Track` table without a default value. This is not possible if the table is not empty.

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

-- DropForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" DROP CONSTRAINT "_CodeLanguageToProblemStatement_A_fkey";

-- DropForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" DROP CONSTRAINT "_CodeLanguageToProblemStatement_B_fkey";

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
ALTER TABLE "ProblemStatement" DROP COLUMN "boilerPlateCode",
DROP COLUMN "correctCode",
DROP COLUMN "mainCode",
ADD COLUMN     "problemId" TEXT;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "inputs",
ADD COLUMN     "expectedOutput" TEXT NOT NULL,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "input" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "Subject",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TrackProblems";

-- DropTable
DROP TABLE "_CodeLanguageToProblemStatement";

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "boilerPlateCode" TEXT NOT NULL,
    "mainCode" TEXT NOT NULL,
    "correctCode" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "codeLaungageId" INTEGER NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semister" "Semister" NOT NULL,
    "courseId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_problemId_key" ON "Program"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_codeLaungageId_key" ON "Program"("codeLaungageId");

-- CreateIndex
CREATE UNIQUE INDEX "MCQQuestion_problemId_key" ON "MCQQuestion"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_trackId_key" ON "Problem"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStatement_problemId_key" ON "ProblemStatement"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizScore_problemId_key" ON "QuizScore"("problemId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ProblemStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_codeLaungageId_fkey" FOREIGN KEY ("codeLaungageId") REFERENCES "CodeLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizScore" ADD CONSTRAINT "QuizScore_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
