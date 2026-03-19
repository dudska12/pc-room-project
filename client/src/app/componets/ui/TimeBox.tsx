"use client";

import { useTimeStore } from "@/store/useTimeStore";
import { useEffect } from "react";

export default function TimeBox() {
  const { timeLeft, decreaseTime, setTime } = useTimeStore();
  useEffect(() => {
    setTime(5400); // 테스트용
    const timer = setInterval(() => {
      decreaseTime();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>남은 시간 : {timeLeft ?? "로딩중..."}</div>;
}
