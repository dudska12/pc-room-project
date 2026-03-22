// app/actions/auth.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function signup(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userId = formData.get("userId") as string; // 사용자가 입력한 로그인 ID
  const name = formData.get("name") as string;

  try {
    // 1. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Supabase Auth에 사용자 등록
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("1단계(Auth) 실패:", authError.message);
      return { error: authError.message };
    }

    // 3. 우리 DB(User 테이블)에 프로필 저장
    if (authData.user) {
      console.log("1단계(Auth) 성공! 유저 ID:", authData.user.id);

      try {
        const newUser = await prisma.user.create({
          data: {
            id: authData.user.id, // Supabase Auth의 UUID
            userId: userId, // 실제 로그인용 ID (Unique)
            password: hashedPassword,
            name: name,
            remainingTime: 0, // 스키마의 Int 타입에 맞춤
            point: 0, // 포인트 초기화
            role: "USER", // Enum 값 (기본값)
          },
        });

        console.log("2단계(DB) 저장 성공:", newUser.userId);
        return { success: true };
      } catch (dbError: any) {
        console.error("2단계(DB) 저장 실패 상세:", dbError);
        // 여기서 5432 에러가 계속 난다면 주소 설정 문제입니다!
        return { error: `DB 저장 실패: ${dbError.message}` };
      }
    }
  } catch (error: any) {
    console.error("전체 공정 실패:", error);
    return { error: "예상치 못한 오류가 발생했습니다." };
  }
}
