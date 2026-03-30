// app/page.tsx
import LayoutPanel from "./componets/ui/LayoutPanel";
import TimeGuard from "./componets/ui/LockoutGuard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // single()을 써서 배열이 아닌 '객체'로 가져옵니다.
  const { data, error } = await supabase.from("User").select("*"); // 'U'대문자로 시도

  console.log("데이터 확인:", data); // 서버 터미널(VS Code)에 찍힙니다.
  console.log("에러 확인:", error);
  if (!data || data.length === 0) {
    return (
      <p>
        DB에 데이터가 없습니다. SQL Editor에서 INSERT 문으로 유저를 하나
        만들어보세요.
      </p>
    );
  }

  const user = data[0];

  return (
    <main>
      {/* TimeGuard가 user 데이터를 검사해서 0분이면 메인 UI(LayoutPanel)를 아예 안 그려줌 */}
      <TimeGuard
        userData={user}
        refreshUser={async () => {
          "use server"; /* 갱신 로직 */
        }}
      >
        <LayoutPanel />
      </TimeGuard>
    </main>
  );
}
