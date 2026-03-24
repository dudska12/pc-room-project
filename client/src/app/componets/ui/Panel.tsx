"use client";
import { useState } from "react";
import TimeBox from "./TimeBox";
import MenuButtons from "./MenuButtons";
import FoodModal from "./FoodModal";
import ChargeModal from "./ChargeModal";
import TimeGuard from "./TimeGuard"; // ✅ 가드 컴포넌트 임포트
import style from "./css/Panel.module.css";
import { useUser } from "@/app/hooks/useUser";

export default function Panel() {
  const [open, setOpen] = useState<null | "charge" | "food">(null);
  const { userData, loading, refreshUser, error } = useUser();

  if (loading) return <div>데이터 로딩 중...</div>;
  if (error || !userData) return <div>시스템 연동 오류</div>;

  return (
    // ✅ 전체를 TimeGuard로 감쌉니다.
    <TimeGuard userData={userData} refreshUser={refreshUser}>
      <div className={style.Panel}>
        <div className={style.topBar}>
          <span
            style={{ fontSize: "12px", color: "#00d2ff", fontWeight: "bold" }}
          >
            NY-MANAGER
          </span>
          <button className={style.topButton}>사용종료</button>
        </div>

        <TimeBox
          userId={userData.id}
          initialRemainingTime={userData.remainingTime}
          lastChargeAmount={userData.lastCharge || 0}
        />

        <div className={style.adArea}>이벤트: 신규 메뉴 '치즈라볶이' 출시!</div>

        <MenuButtons onOpen={setOpen} />
      </div>

      {/* 일반적인 상황에서 버튼 눌러서 여는 모달들 */}
      {open === "charge" && (
        <ChargeModal
          userId={userData.id}
          onClose={() => setOpen(null)}
          refreshUser={refreshUser}
        />
      )}
      {open === "food" && <FoodModal onClose={() => setOpen(null)} />}
    </TimeGuard>
  );
}
