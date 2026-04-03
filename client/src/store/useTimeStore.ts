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
    if (state.timeLeft === null || state.timeLeft <= 0) return;

    const nextTime = state.timeLeft - 1;
    set({ timeLeft: nextTime });

    // 🛡️ 서버 동기화 로직 개선
    // 1. lastSavedTime과 현재 시간의 차이가 60초 이상인가?
    // 2. 현재 동기화 중(isSyncing)이 아닌가?
    const timeDiff = (state.lastSavedTime || 0) - nextTime;

    if (timeDiff >= 60 && !state.isSyncing) {
      // 동기화 시작 전 즉시 lastSavedTime을 업데이트하여 중복 요청 방지
      set({
        isSyncing: true,
        lastSavedTime: nextTime, // 요청을 보내기 전에 미리 시간을 찍어둡니다.
      });

      // 비동기로 서버에 알림 (tick의 흐름을 방해하지 않음)
      syncUserTime(userId)
        .then(() => {
          console.log(`🚀 [서버 동기화 성공] 남은 시간: ${nextTime}s`);
        })
        .catch((error) => {
          console.error("동기화 실패:", error);
          // 실패 시 다음 주기(60초 뒤)에 다시 시도하도록 lastSavedTime은 유지됩니다.
        })
        .finally(() => {
          set({ isSyncing: false });
        });
    }

    if (nextTime <= 0) {
      // 차단 화면은 TimeGuard가 처리하므로 굳이 reload할 필요는 없지만,
      // 확실한 종료를 위해 둡니다.
      window.location.reload();
    }
  },
}));
