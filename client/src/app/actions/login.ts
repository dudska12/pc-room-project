"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// 반환 타입 정의 (타입 에러 방지용)
export type LoginResponse = {
  success: boolean;
  error: string | null;
  user?: {
    name: string | null;
    role: string | null;
  } | null;
};

export async function login(
  prevState: any,
  formData: FormData,
): Promise<LoginResponse | void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 성공 시 리다이렉트할 경로를 저장할 변수
  let redirectTo: string | null = null;

  try {
    // 1. Supabase Auth 로그인
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        error: "로그인 정보가 일치하지 않습니다.",
        user: null,
      };
    }

    // 2. Prisma에서 사용자 정보 확인
    const userProfile = await prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!userProfile) {
      return {
        success: false,
        error: "등록된 사용자 정보가 없습니다.",
        user: null,
      };
    }

    // 🔥 [추가] 여기서 쿠키를 굽습니다!
    // API Route에서 이 이름을 똑같이 사용할 겁니다.
    cookieStore.set("userId", userProfile.id, {
      path: "/",
      httpOnly: true, // 보안을 위해 설정
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1주일 유지
    });
    revalidatePath("/", "layout");

    // ✅ 성공 시 리다이렉트 경로 설정
    redirectTo = "/";
  } catch (error) {
    console.error("로그인 프로세스 에러:", error);
    return { success: false, error: "서버 오류가 발생했습니다.", user: null };
  }

  // ✅ try-catch 밖에서 리다이렉트 실행 (Next.js 권장 방식)
  if (redirectTo) {
    redirect(redirectTo);
  }

  // 기본 반환값 (실행될 일은 거의 없지만 타입 안전성을 위해)
  return {
    success: false,
    error: "알 수 없는 오류가 발생했습니다.",
    user: null,
  };
}
