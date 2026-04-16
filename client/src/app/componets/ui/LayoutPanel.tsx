"use client";

import { usePathname } from "next/navigation"; // 경로 확인용
import Panel from "@/app/componets/ui/Panel";
import style from "./css/LayoutPanel.module.css";

export default function LayoutPanel({ user }: { user: any }) {
  const pathname = usePathname();

  // 현재 경로가 /login (또는 로그인 관련 경로) 인지 확인
  const isLoginPage = pathname.includes("/login");

  return (
    /* 💡 로그인 페이지일 때는 별도의 클래스(loginLayout)를 추가합니다. */
    <div className={`${style.layout} ${isLoginPage ? style.loginLayout : ""}`}>
      {/* 로그인 페이지가 아닐 때만 '메인 영역(빈 공간)'을 보여줍니다. */}
      {!isLoginPage && <div className={style.main}></div>}

      {/* 패널 영역 (로그인 페이지일 때는 LoginPage가 이 자리에 들어오거나, 
          로그인 후에는 Panel이 렌더링됨) */}
      <Panel user={user} />
    </div>
  );
}
