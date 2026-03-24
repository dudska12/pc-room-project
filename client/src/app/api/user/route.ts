// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; // ✅ 쿠키를 가져오기 위해 추가

export async function GET() {
  try {
    const cookieStore = await cookies();
    // ✅ 로그인 시 저장했던 쿠키 이름을 넣으세요 (예: "session", "userId" 등)
    const sessionCookie = cookieStore.get("userId");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    // 쿠키에 저장된 ID로 실제 DB 유저 조회
    const user = await prisma.user.findUnique({
      where: {
        // DB의 primary key인 id(UUID)를 쿠키에 저장했다면 id로,
        // 로그인용 아이디를 저장했다면 userId로 조회하세요.
        id: sessionCookie.value,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "DB 연동 실패" }, { status: 500 });
  }
}
