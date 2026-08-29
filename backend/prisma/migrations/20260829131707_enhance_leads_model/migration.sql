-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'web_form';

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");
