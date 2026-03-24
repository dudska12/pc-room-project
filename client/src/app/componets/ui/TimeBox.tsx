"use client";

import { useTimeStore } from "@/store/useTimeStore";
import { useEffect, useState } from "react";
import style from "./css/TimeBox.module.css";

interface TimeBoxProps {
  initialRemainingTime: number; // DB의 보유 시간 (초 단위)
  lastChargeAmount: number; // 마지막 충전 금액 (예: 10000)
}

export default function TimeBox({
  initialRemainingTime,
  lastChargeAmount,
}: TimeBoxProps) {
  const { timeLeft, decreaseTime, setTime } = useTimeStore();

  // ✅ 사용시간 (로그인 후 흐른 시간 - 초 단위로 관리)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // 1. 초기 보유 시간 세팅
    setTime(initialRemainingTime);

    // 2. 1초마다 타이머 작동
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1); // 사용시간은 증가
      decreaseTime(); // 남은시간은 감소
    }, 1000);

    return () => clearInterval(timer);
  }, [initialRemainingTime, setTime, decreaseTime]);

  // ✅ 초 단위를 버리고 "시간:분"으로 포맷팅하는 함수
  const formatToMin = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className={style.infoContainer}>
      {/* 1. 사용시간 (00:00부터 올라감) */}
      <div className={style.row}>
        <span>사용시간</span>
        <span className={style.value}>{formatToMin(elapsedSeconds)}</span>
      </div>

      {/* 2. 남은시간 (보유 시간에서 내려감) */}
      <div className={style.row}>
        <span className={style.blueText}>남은시간</span>
        <span className={style.blueValue}>{formatToMin(timeLeft ?? 0)}</span>
      </div>

      {/* 3. 요금영역 (가장 최근 충전 금액 고정) */}
      <div className={style.row}>
        <span>선불요금</span>
        <span className={style.value}>
          {lastChargeAmount.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
