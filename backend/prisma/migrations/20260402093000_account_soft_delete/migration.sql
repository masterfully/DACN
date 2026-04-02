-- Add soft-delete columns
ALTER TABLE "Account"
ADD COLUMN "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "DeletedAt" TIMESTAMP(3);

-- Replace hard unique constraints with active-only unique indexes
DROP INDEX IF EXISTS "Account_Username_key";
DROP INDEX IF EXISTS "Account_Email_key";

CREATE UNIQUE INDEX "Account_Username_active_key"
ON "Account"("Username")
WHERE "IsDeleted" = false;

CREATE UNIQUE INDEX "Account_Email_active_key"
ON "Account"("Email")
WHERE "IsDeleted" = false;

CREATE INDEX "Account_IsDeleted_idx"
ON "Account"("IsDeleted");
