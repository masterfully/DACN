/*
  Warnings:

  - A unique constraint covering the columns `[ApplicationID,CertificateTypeID]` on the table `CertificateDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_Email_active_key";

-- DropIndex
DROP INDEX "Account_IsDeleted_idx";

-- DropIndex
DROP INDEX "Account_Username_active_key";

-- AlterTable
ALTER TABLE "CertificateDetail" ADD COLUMN     "CreatedByAccountID" INTEGER;

-- CreateTable
CREATE TABLE "UserParents" (
    "StudentID" INTEGER NOT NULL,
    "ParentID" INTEGER NOT NULL,

    CONSTRAINT "UserParents_pkey" PRIMARY KEY ("StudentID","ParentID")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateDetail_ApplicationID_CertificateTypeID_key" ON "CertificateDetail"("ApplicationID", "CertificateTypeID");

-- AddForeignKey
ALTER TABLE "UserParents" ADD CONSTRAINT "UserParents_StudentID_fkey" FOREIGN KEY ("StudentID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParents" ADD CONSTRAINT "UserParents_ParentID_fkey" FOREIGN KEY ("ParentID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateDetail" ADD CONSTRAINT "CertificateDetail_CreatedByAccountID_fkey" FOREIGN KEY ("CreatedByAccountID") REFERENCES "Account"("AccountID") ON DELETE SET NULL ON UPDATE CASCADE;
