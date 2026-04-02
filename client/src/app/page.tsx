// app/page.tsx
import { redirect } from "next/navigation";
import LayoutPanel from "./componets/ui/LayoutPanel";
import TimeGuard from "./componets/ui/TimeGuard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. 로그인 시 구워뒀던 쿠키(userId)를 가져옵니다.
  const loggedInUserId = cookieStore.get("userId")?.value;

  // 2. 쿠키가 없으면 로그인 안 한 거니까 로그인 페이지로 튕깁니다.
  if (!loggedInUserId) {
    redirect("/auth/login");
  }

  // 3. .eq("id", ...)를 써서 로그인한 사람의 데이터만 '딱 하나' 가져옵니다.
  const { data: user, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", loggedInUserId) // 이 부분이 핵심!
    .single(); // 배열이 아닌 단일 객체로 받기

  // 4. 에러가 나거나 유저가 없으면 예외 처리
  if (error || !user) {
    console.error("유저 조회 실패:", error);
    return (
      <div style={{ color: "white", padding: "20px" }}>
        유저 정보를 찾을 수 없습니다. 다시 로그인해주세요.
      </div>
    );
  }
  return (
    <main>
      {/* TimeGuard가 user 데이터를 검사해서 0분이면 메인 UI(LayoutPanel)를 아예 안 그려줌 */}
      <TimeGuard
        userData={user}
        refreshUser={async () => {
          "use server"; /* 갱신 로직 */
        }}
      >
        <LayoutPanel user={user} />
      </TimeGuard>
    </main>
  );
}
