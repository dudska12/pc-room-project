"use client";
import React, { useEffect, useRef } from "react";
import { useLockout } from "@/app/hooks/useLockout";
import { useTimeStore } from "@/store/useTimeStore";
import ChargeModal from "./ChargeModal";
import style from "./css/TimeGuard.module.css"; // 기존 CSS 파일 경로 확인

interface Props {
  userData: any;
  children: React.ReactNode;
  refreshUser: () => Promise<void>;
}

export default function TimeGuard({ userData, children, refreshUser }: Props) {
  const setTime = useTimeStore((state) => state.setTime);

  const announced = useRef<{ [key: number]: boolean }>({});

  // 1. 타이머 훅 (서버 시간 차감 핵심 로직)
  const { timeLeft, isLocked } = useLockout(
    userData.remainingTime,
    userData.id,
  );

  // 유저 변경 시 시간 동기화
  useEffect(() => {
    if (userData) {
      console.log(
        `[ID 전환 확인] ${userData.userId} 접속: DB 시간(${userData.remainingTime}s) 주입`,
      );
      setTime(userData.remainingTime);
    }
  }, [userData.id, setTime, userData.remainingTime]);

  // ⭐ 실시간 음성 알림 로직
  useEffect(() => {
    if (timeLeft === null) return;

    const speak = (text: string) => {
      // 브라우저 내장 음성 합성 API (별도 설치 필요 없음)
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = "ko-KR"; // 한국어 설정
      window.speechSynthesis.speak(msg);
    };

    // 10분(600초) 남았을 때 (정확히 600초가 아닐 수 있으므로 범위를 줍니다)
    if (timeLeft <= 600 && timeLeft > 590 && !announced.current[600]) {
      speak("사용 시간이 10분 남았습니다.");
      announced.current[600] = true;
    }

    // 5분(300초) 남았을 때
    if (timeLeft <= 300 && timeLeft > 290 && !announced.current[300]) {
      speak("사용 시간이 5분 남았습니다. 미리 충전해 주세요.");
      announced.current[300] = true;
    }

    // 유저가 충전을 해서 시간이 다시 늘어나면 체크 변수 초기화
    if (timeLeft > 600) {
      announced.current = {};
    }
  }, [timeLeft]);

  // 2. 데이터 로딩 중 (기존 .loadingContainer 클래스 사용)
  if (timeLeft === null && !userData) {
    return (
      <div className={style.loadingContainer}>
        사용자 데이터를 확인 중입니다...
      </div>
    );
  }

  // 3. 시간이 없거나 잠긴 경우 (기존 .lockoutOverlay 클래스 등 사용)
  if (isLocked || (timeLeft !== null && timeLeft <= 0)) {
    return (
      <div className={style.lockoutOverlay}>
        <div className={style.lockoutBox}>
          <div className={style.lockoutHeader}>
            <h2 className={style.lockoutTitle}>TIME OUT</h2>
          </div>
          <div className={style.lockoutContent}>
            <p className={style.lockoutMessage}>
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

  // 4. 정상 상태일 때는 아무런 레이아웃 방해 없이 children만 반환
  return <>{children}</>;
}
