"use client";
import { useEffect } from "react";
import { useTimeStore } from "@/store/useTimeStore";

export function useLockout(initialSeconds: number, userId: string) {
  const { timeLeft, setTime, tick } = useTimeStore();

  useEffect(() => {
    // 초기 시간 설정 (처음 한 번만)
    if (timeLeft === null) {
      setTime(initialSeconds);
    }

    if (typeof window !== "undefined" && (window as any).pcTimer) return;

    const timer = setInterval(() => {
      tick(userId); // Zustand의 tick 실행 (여기서 모든 계산/POST 결정)
    }, 1000);

    (window as any).pcTimer = timer;

    return () => {
      clearInterval(timer);
      (window as any).pcTimer = null;
    };
  }, [userId, tick, setTime, initialSeconds, timeLeft]);

  return {
    timeLeft,
    isLocked: timeLeft !== null && timeLeft <= 0,
  };
}
