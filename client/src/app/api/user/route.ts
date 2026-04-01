// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; // ✅ 쿠키를 가져오기 위해 추가

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("userId");

    console.log("-----------------------------------------");
    console.log("현재 API 요청을 보낸 쿠키 ID:", sessionCookie?.value);
    console.log("-----------------------------------------");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: sessionCookie.value, // 쿠키에 저장된 UUID로 조회
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 🛡️ 보안: 비밀번호 등 민감한 정보는 클라이언트에 보내지 않음
    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "DB 연동 실패" }, { status: 500 });
  }
}
