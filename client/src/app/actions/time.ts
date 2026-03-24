"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 주기적 시간 업데이트 (차감 저장)
export async function syncUserTime(userId: string, remainingTime: number) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { remainingTime: Math.max(0, remainingTime) },
    });
    return { success: true };
  } catch (error) {
    return { error: "시간 동기화 실패" };
  }
}

// 2. 요금제 충전 로직
export async function chargeTime(
  userId: string,
  amount: number,
  secondsToAdd: number,
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        remainingTime: { increment: secondsToAdd }, // 시간 추가
        point: { increment: Math.floor(amount * 0.1) }, // 10% 포인트 적립 (옵션)
        // lastChargeAmount 필드가 있다면 업데이트
        // lastCharge: amount
      },
    });

    revalidatePath("/"); // 대시보드 데이터 갱신
    return { success: true, newTime: updatedUser.remainingTime };
  } catch (error) {
    return { error: "충전 처리 실패" };
  }
}
