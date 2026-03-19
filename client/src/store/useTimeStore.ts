import { create } from "zustand";

type TimeState = {
  timeLeft: number | null;
  setTime: (time: number) => void;
  decreaseTime: () => void;
};

export const useTimeStore = create<TimeState>((set) => ({
  timeLeft: null,

  setTime: (time) => set({ timeLeft: time }),

  decreaseTime: () =>
    set((state) => ({
      timeLeft:
        state.timeLeft !== null && state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    })),
}));
