"use client";

import { useTimeStore } from "@/store/useTimeStore";
import { useEffect, useState, useRef } from "react";
import { syncUserTime } from "@/app/actions/time";
import { useRouter } from "next/navigation";
import style from "./css/TimeBox.module.css";

interface TimeBoxProps {
  userId: string; // ✅ DB 업데이트를 위해 유저 ID 추가
  initialRemainingTime: number;
  lastChargeAmount: number;
}

export default function TimeBox({
  userId,
  initialRemainingTime,
  lastChargeAmount,
}: TimeBoxProps) {
  const { timeLeft, decreaseTime, setTime } = useTimeStore();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const router = useRouter();

  // ✅ 동기화 주기를 관리하기 위한 Ref (화면 리렌더링과 상관없이 값 유지)
  const syncCounter = useRef(0);

  useEffect(() => {
    setTime(initialRemainingTime);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      decreaseTime();

      // ✅ 60초마다 DB에 현재 남은 시간 저장 (새로고침/팅김 방지)
      syncCounter.current += 1;
      if (syncCounter.current >= 60) {
        if (timeLeft !== null) syncUserTime(userId, timeLeft);
        syncCounter.current = 0;
      }
    }, 1000);

    return () => {
      // ✅ 컴포넌트 언마운트(종료) 시 마지막 시간 저장
      if (timeLeft !== null) syncUserTime(userId, timeLeft);
      clearInterval(timer);
    };
  }, [initialRemainingTime, setTime, decreaseTime, userId, timeLeft]);

  // ✅ 시간이 0이 되면 강제 종료 로직
  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0) {
      alert("잔여 시간이 없습니다. 시스템을 종료합니다.");
      router.push("/login"); // 로그인 화면으로 튕기기
    }
  }, [timeLeft, router]);

  const formatToMin = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className={style.infoContainer}>
      <div className={style.row}>
        <span>사용시간</span>
        <span className={style.value}>{formatToMin(elapsedSeconds)}</span>
      </div>

      <div className={style.row}>
        <span className={style.blueText}>남은시간</span>
        <span className={style.blueValue}>{formatToMin(timeLeft ?? 0)}</span>
      </div>

      <div className={style.row}>
        <span>선불요금</span>
        <span className={style.value}>
          {(lastChargeAmount || 0).toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
