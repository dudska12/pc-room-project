import { PrismaClient } from "@prisma/client/extension";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7 방식: 직접 URL을 전달하거나 어댑터를 사용합니다.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
