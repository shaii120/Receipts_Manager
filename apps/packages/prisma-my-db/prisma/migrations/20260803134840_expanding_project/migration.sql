/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Receipt` table. All the data in the column will be lost.
  - Added the required column `primaryCurrency` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boughtAt` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `UserProject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- AlterTable
ALTER TABLE   "Project"
ADD COLUMN    "primaryCurrency" TEXT,
ADD COLUMN    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

UPDATE        "Project"
SET           "primaryCurrency" = 'ILS';

ALTER TABLE   "Project"
ALTER COLUMN  "primaryCurrency" SET NOT NULL;

-- AlterTable
ALTER TABLE "Receipt"
RENAME COLUMN "createdAt" TO "boughtAt";

-- AlterTable
ALTER TABLE "UserProject"
ADD COLUMN  "role" "ProjectRole";

UPDATE "UserProject"
SET "role" = 'OWNER';

ALTER TABLE "UserProject"
ALTER COLUMN "role" SET NOT NULL;