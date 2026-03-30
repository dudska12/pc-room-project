// src/app/componets/ui/TimeBox.tsx
"use client";
import { useTimeStore } from "@/store/useTimeStore";
import { useState, useEffect } from "react";
import style from "./css/TimeBox.module.css";

// 인테페이스를 lastChargeAmount만 받도록 확정합니다.
interface TimeBoxProps {
  lastChargeAmount: number;
}

export default function TimeBox({ lastChargeAmount }: TimeBoxProps) {
  const { timeLeft } = useTimeStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const format = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className={style.infoContainer}>
      <div className={style.row}>
        <span>사용시간</span>
        <span className={style.value}>{format(elapsed)}</span>
      </div>
      <div className={style.row}>
        <span className={style.blueText}>남은시간</span>
        <span className={style.blueValue}>{format(timeLeft ?? 0)}</span>
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