/*
  Warnings:

  - You are about to drop the column `userId` on the `Proposal` table. All the data in the column will be lost.
  - The `status` column on the `Proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `freelancerId` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'VIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_userId_fkey";

-- DropIndex
DROP INDEX "Proposal_userId_status_idx";

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "userId",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "clientMessage" TEXT,
ADD COLUMN     "freelancerId" INTEGER NOT NULL,
ADD COLUMN     "interviewAt" TIMESTAMP(3),
ADD COLUMN     "lastClientActivityAt" TIMESTAMP(3),
ADD COLUMN     "meetingUrl" TEXT,
ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "viewedAt" TIMESTAMP(3),
ADD COLUMN     "withdrawnAt" TIMESTAMP(3),
ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "timeline" DROP NOT NULL,
ALTER COLUMN "portfolioLinks" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "ProposalAttachment" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "ProposalAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProposalAttachment_proposalId_idx" ON "ProposalAttachment"("proposalId");

-- CreateIndex
CREATE INDEX "Proposal_freelancerId_status_idx" ON "Proposal"("freelancerId", "status");

-- CreateIndex
CREATE INDEX "Proposal_updatedAt_idx" ON "Proposal"("updatedAt");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalAttachment" ADD CONSTRAINT "ProposalAttachment_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
