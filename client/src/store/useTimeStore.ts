import { create } from "zustand";
import { syncUserTime } from "@/app/actions/time";

type TimeState = {
  timeLeft: number | null;
  lastSavedTime: number | null;
  isSyncing: boolean;
  setTime: (time: number) => void;
  // 1초마다 실행될 함수
  tick: (userId: string) => void;
};

export const useTimeStore = create<TimeState>((set, get) => ({
  timeLeft: null,
  lastSavedTime: null,
  isSyncing: false,

  setTime: (time) => set({ timeLeft: time, lastSavedTime: time }),

  tick: async (userId) => {
    const { timeLeft, lastSavedTime, isSyncing } = get();
    if (timeLeft === null || timeLeft <= 0) return;

    const nextTime = timeLeft - 1;
    set({ timeLeft: nextTime });

    // 🛡️ 정확히 60초가 차이 날 때만 서버 동기화 (1초마다 POST 방지)
    if (
      lastSavedTime !== null &&
      lastSavedTime - nextTime >= 60 &&
      !isSyncing
    ) {
      set({ isSyncing: true });
      try {
        await syncUserTime(userId); // 서버 액션 호출
        set({ lastSavedTime: nextTime }); // 기준점 갱신
        console.log("🚀 [서버 동기화 완료] -60s");
      } catch (error) {
        console.error("동기화 실패:", error);
      } finally {
        set({ isSyncing: false });
      }
    }

    // 시간이 다 되면 새로고침 등 처리
    if (nextTime <= 0) {
      window.location.reload();
    }
  },
}));
