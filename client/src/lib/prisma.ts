// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 에러 방지를 위해 타입을 명시적으로 처리하거나, 기본 생성자를 사용합니다.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 'datasources' 에러가 난다면 아래처럼 환경변수를 직접 주입하는 대신
    // Prisma가 내부적으로 .env를 읽도록 기본값으로 두는 것이 가장 안전합니다.
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
