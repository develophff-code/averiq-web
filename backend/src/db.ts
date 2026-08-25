import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;
let isDbAvailable = false;

try {
  prismaInstance = new PrismaClient();
} catch (err) {
  console.warn('[DB] Prisma initialization warning. Running in memory/log fallback mode.');
}

export async function checkDbConnection(): Promise<boolean> {
  if (!prismaInstance) return false;
  try {
    await prismaInstance.$connect();
    isDbAvailable = true;
    console.log('[DB] PostgreSQL connection verified via Prisma.');
    return true;
  } catch (err) {
    isDbAvailable = false;
    console.warn('[DB] PostgreSQL is not yet connected or configured. Leads will be logged and safely handled in fallback mode.');
    return false;
  }
}

export const db = prismaInstance;
export { isDbAvailable };
