// app/actions/auth.ts
'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"; // import 방식 확인 (bcryptjs면 bcryptjs로)

export async function signup(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;

  // 1. [수정] 비밀번호 암호화 (Salt Rounds: 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Supabase Auth에 사용자 등록
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password, // Supabase Auth는 내부에서 자체 암호화하므로 원본을 보냅니다.
  });

  if (authError) return { error: authError.message };

  // 3. 우리 DB(User 테이블)에 프로필 저장
  if (authData.user) {
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          userId: userId,
          password: hashedPassword, // [수정] 암호화된 비밀번호 저장!
          name: name,
          remainingTime: 0,
        },
      });
      return { success: true };
    } catch (dbError) {
      // 만약 DB 저장 실패 시 Supabase Auth 계정만 남는 걸 방지하려면 
      // 추가적인 롤백 로직이 필요할 수 있지만, 일단은 이렇게 시작해도 좋습니다.
      console.error(dbError);
      return { error: "DB 저장 중 오류가 발생했습니다." };
    }
  }
}