"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 주기적 시간 업데이트 (보안 강화 버전)
export async function syncUserTime(userId: string) {
  console.log("🔔 [서버] 시간 차감 요청 수신됨:", new Date().toLocaleTimeString()); // 이거 찍히나 보세요
  try {
    // 사용자가 준 숫자를 믿지 않고, DB에서 직접 60초(1분)를 차감함
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        remainingTime: {
          decrement: 60, // 서버가 직접 60초 차감 (가장 안전)
        },
      },
    });

    // 0초 이하로 내려가지 않게 방어 로직 (필요 시)
    if (updatedUser.remainingTime < 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { remainingTime: 0 },
      });
    }

    return { success: true, remainingTime: updatedUser.remainingTime };
  } catch (error) {
    console.error("Sync Error:", error);
    return { error: "시간 동기화 실패" };
  }
}

// 2. 요금제 충전 로직 (유지 및 보완)
export async function chargeTime(
  userId: string,
  amount: number,
  secondsToAdd: number,
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        remainingTime: { increment: secondsToAdd },
        point: { increment: Math.floor(amount * 0.1) }, // 10% 적립
      },
    });

    //revalidatePath("/");
    return { success: true, newTime: updatedUser.remainingTime };
  } catch (error) {
    return { error: "충전 처리 실패" };
  }
}
