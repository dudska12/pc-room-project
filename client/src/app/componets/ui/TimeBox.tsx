"use client";

import { useTimeStore } from "@/store/useTimeStore";
import { useEffect } from "react";
import style from "./css/TimeBox.module.css";

export default function TimeBox() {
  const { timeLeft, decreaseTime, setTime } = useTimeStore();

  const initialData = {
    usedTime: "01:26", // 실제로는 사용 시작 시간부터 계산된 로직이 들어가겠죠?
    totalCharge: 10000, // 숫자 타입으로 관리해야 나중에 계산하기 편해요
    chargeType: "선불요금",
  };

  useEffect(() => {
    setTime(5400);
    const timer = setInterval(() => decreaseTime(), 1000);
    return () => clearInterval(timer);
  }, [decreaseTime, setTime]); // 의존성 배열 추가

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className={style.infoContainer}>
      {/* 사용 시간 영역 */}
      <div className={style.row}>
        <span>사용시간</span>
        <span className={style.value}>{initialData.usedTime}</span>
      </div>

      {/* 남은 시간 영역 */}
      <div className={style.row}>
        <span className={style.blueText}>남은시간</span>
        <span className={style.blueValue}>{formatTime(timeLeft ?? 0)}</span>
      </div>

      {/* 요금 영역 */}
      <div className={style.row}>
        <span>{initialData.chargeType}</span>
        <span className={style.value}>
          {initialData.totalCharge.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
