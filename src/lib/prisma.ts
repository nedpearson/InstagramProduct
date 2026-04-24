import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Always cache on globalThis — in Vercel serverless production, NODE_ENV is
// 'production' but the module cache persists across requests within the same
// function instance. Without this, every request creates a new PrismaClient
// and leaks a DB connection, exhausting the Supabase pgBouncer pool.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  });

globalForPrisma.prisma = prisma;
