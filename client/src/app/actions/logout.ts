"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function terminateSession(userId: string, finalTime: number) {
  try {
    // 1. DB 업데이트: 현재 남은 시간을 최종적으로 저장
    // (1분 주기 동기화 사이의 오차를 여기서 최종 정산합니다)
    await prisma.user.update({
      where: { id: userId },
      data: { remainingTime: finalTime },
    });

    // 2. 인증 쿠키 삭제: 클라이언트의 세션을 완전히 파기
    const cookieStore = await cookies();
    cookieStore.delete("userId"); // 로그인 시 설정한 쿠키 키값과 일치해야 함
  } catch (error) {
    console.error("Logout DB Error:", error);
    // DB 저장 실패 시에도 보안을 위해 로그아웃은 진행되어야 함
  }

  // 3. 로그인 페이지로 강제 이동
  redirect("/auth/login");
}
