import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

export async function checkDbConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
