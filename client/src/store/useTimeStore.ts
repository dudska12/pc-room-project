import { create } from "zustand";
import { syncUserTime } from "@/app/actions/time";

type TimeState = {
  timeLeft: number | null;
  lastSavedTime: number | null;
  isSyncing: boolean;
  // 초기화 및 시간 설정
  setTime: (time: number) => void;
  // 로그아웃 시 스토어 완전 초기화
  reset: () => void;
  tick: (userId: string) => void;
};

export const useTimeStore = create<TimeState>((set, get) => ({
  timeLeft: null,
  lastSavedTime: null,
  isSyncing: false,

  // ✅ 새로운 유저가 들어올 때 모든 상태를 동기화
  setTime: (time) =>
    set({
      timeLeft: time,
      lastSavedTime: time,
      isSyncing: false,
    }),

  // ✅ 로그아웃 시 호출할 초기화 함수
  reset: () =>
    set({
      timeLeft: null,
      lastSavedTime: null,
      isSyncing: false,
    }),

  tick: async (userId) => {
    const state = get();
    // timeLeft가 null이거나 0이면 동작하지 않음
    if (state.timeLeft === null || state.timeLeft <= 0) return;

    const nextTime = state.timeLeft - 1;
    set({ timeLeft: nextTime });

    // 🛡️ 서버 동기화 로직 (기존 유지)
    if (
      state.lastSavedTime !== null &&
      state.lastSavedTime - nextTime >= 60 &&
      !state.isSyncing
    ) {
      set({ isSyncing: true });
      try {
        await syncUserTime(userId);
        set({ lastSavedTime: nextTime });
        console.log("🚀 [서버 동기화 완료] 유저:", userId);
      } catch (error) {
        console.error("동기화 실패:", error);
      } finally {
        set({ isSyncing: false });
      }
    }

    // 시간이 다 됐을 때 처리
    if (nextTime <= 0) {
      // ⚠️ 강제 새로고침은 유저 경험에 좋지 않을 수 있으니 나중에 UI 차단으로 대체 권장
      window.location.reload();
    }
  },
}));
