import LayoutPanel from "./componets/ui/LayoutPanel";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers"; // 1. cookies 임포트

export default async function Home() {
  const cookieStore = await cookies(); // 2. 쿠키 가져오기 (Next.js 15+ 라면 await 필요)
  const supabase = createClient(cookieStore); // 3. 인자로 전달

  const { data, error } = await supabase.from("user").select("*").limit(1);

  return (
    <div>
      {error ? <p>에러: {error.message}</p> : <p>연결 성공!</p>}
      <LayoutPanel />
    </div>
  );
}
