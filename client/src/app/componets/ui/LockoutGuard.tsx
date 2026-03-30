"use client";
import React from "react";
import { useLockout } from "@/app/hooks/useLockout";
import ChargeModal from "./ChargeModal";
import style from "./css/FoodModal.module.css"; // 기존에 쓰시던 오버레이 스타일 활용

interface Props {
  userData: any;
  children: React.ReactNode;
  refreshUser: () => Promise<void>;
}

export default function TimeGuard({ userData, children, refreshUser }: Props) {
  const { timeLeft, isLocked } = useLockout(userData.remainingTime, userData.id);

  // 1. [해결 핵심] null일 때 먼저 리턴해서 아래 로직에서 timeLeft가 number임을 보장함
  if (timeLeft === null) {
    return (
      <div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
        데이터 동기화 중...
      </div>
    );
  }

  // 2. 이제 timeLeft는 무조건 숫자이므로 에러(ts18047)가 발생하지 않음
  if (isLocked || timeLeft <= 0) {
    return (
      <div className={style.confirmOverlay} style={{ backgroundColor: "rgba(0,0,0,0.95)" }}>
        <div className={style.confirmBox} style={{ textAlign: "center", border: "2px solid #ff4d4d" }}>
          <div className={style.confirmHeader}>
            <h2 style={{ color: "#ff4d4d", fontSize: "2rem", margin: "10px 0" }}>TIME OUT</h2>
          </div>
          <div className={style.confirmContent}>
            <p style={{ color: "#ccc", marginBottom: "20px" }}>
              잔여 시간이 없습니다. 충전 후 이용해 주세요.
            </p>
            <ChargeModal
              userId={userData.id}
              onClose={() => alert("충전 후 이용 가능합니다.")}
              refreshUser={refreshUser}
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}