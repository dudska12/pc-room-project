"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // ✅ 캐시 갱신을 위해 추가

export async function terminateSession(userId: string, finalTime: number) {
  try {
    // 1. DB 업데이트 (현재 시간 최종 저장)
    await prisma.user.update({
      where: { id: userId },
      data: { remainingTime: finalTime },
    });

    const cookieStore = await cookies();

    // 2. 인증 쿠키 삭제 (더 확실한 방법)
    // 단순히 delete만 하지 말고, 만료 시간을 과거로 돌려서 강제 삭제합니다.
    cookieStore.set("userId", "", {
      path: "/", // ✅ 중요: 구울 때와 똑같은 경로를 지정해야 함
      maxAge: 0, // 즉시 만료
      expires: new Date(0), // 1970년으로 설정해서 즉시 삭제 유도
    });

    // 3. 페이지 캐시 무효화
    // 다음 유저가 들어왔을 때 이전 유저의 데이터를 보여주지 않도록 캐시를 비웁니다.
    revalidatePath("/");
  } catch (error) {
    console.error("Logout DB Error:", error);
  }

  // 4. 로그인 페이지로 강제 이동
  redirect("/auth/login");
}
