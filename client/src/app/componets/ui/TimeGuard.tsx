"use client";
import React, { useEffect } from "react";
import { useLockout } from "@/app/hooks/useLockout";
import { useTimeStore } from "@/store/useTimeStore"; // ✅ Zustand 스토어 필수
import ChargeModal from "./ChargeModal";
import style from "./css/FoodModal.module.css";

interface Props {
  userData: any;
  children: React.ReactNode;
  refreshUser: () => Promise<void>;
}

export default function TimeGuard({ userData, children, refreshUser }: Props) {
  // 1. Zustand의 setTime 함수를 가져옵니다 (숫자판 덮어쓰기용)
  const setTime = useTimeStore((state) => state.setTime);

  // 2. 훅을 통해 현재 실시간 남은 시간을 계산합니다.
  const { timeLeft, isLocked } = useLockout(
    userData.remainingTime,
    userData.id,
  );

  // ⭐ [데이터 꼬임 방지 핵심 코드] ⭐
  // 유저가 바뀌어서 들어오면(ID가 달라지면),
  // Zustand 메모리에 남은 이전 유저의 시간을 서버 데이터(0초 또는 1시간 등)로 강제 교체합니다.
  useEffect(() => {
    if (userData) {
      console.log(
        `[ID 전환 확인] ${userData.userId} 접속: DB 시간(${userData.remainingTime}s) 주입`,
      );
      setTime(userData.remainingTime);
    }
  }, [userData.id, setTime]); // 👈 ID가 바뀔 때만 작동해서 효율적입니다.

  // 데이터 로딩 중일 때 (null 방어)
  if (timeLeft === null) {
    return (
      <div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
        사용자 데이터를 확인 중입니다...
      </div>
    );
  }

  // 3. 시간이 없거나 잠긴 경우 (차단 화면)
  if (isLocked || timeLeft <= 0) {
    return (
      <div
        className={style.confirmOverlay}
        style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
      >
        <div
          className={style.confirmBox}
          style={{ textAlign: "center", border: "2px solid #ff4d4d" }}
        >
          <div className={style.confirmHeader}>
            <h2
              style={{ color: "#ff4d4d", fontSize: "2rem", margin: "10px 0" }}
            >
              TIME OUT
            </h2>
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

  // 4. 시간이 남아있으면 정상적으로 화면을 보여줌
  return <>{children}</>;
}
