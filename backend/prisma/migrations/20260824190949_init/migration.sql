-- CreateEnum
CREATE TYPE "ServiceInterest" AS ENUM ('CHATBOT_SUPPORT', 'CHATBOT_SALES', 'POS', 'ACCOUNTS_PAYABLE', 'CLINICS', 'CONSULTING', 'SAAS_CUSTOM', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NUEVO', 'CONTACTADO', 'EN_EVALUACION', 'CONVERTIDO', 'DESCARTADO');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "service_interest" "ServiceInterest" NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'es',
    "status" "LeadStatus" NOT NULL DEFAULT 'NUEVO',
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");
