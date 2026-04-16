// src/hooks/useMouseIgnore.ts
import { useEffect } from "react";

export const useMouseIgnore = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isElectron = navigator.userAgent.toLowerCase().includes("electron");
    if (!isElectron) return;

    const { ipcRenderer } = window.require("electron");

    // 💡 개별 요소에 리스너를 거는 게 아니라, window 전체에서 감시합니다.
    // 그래야 나중에 생겨난 모달(panel-container)도 즉시 인식합니다.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".panel-container")) {
        ipcRenderer.send("set-ignore-mouse", false); // 클릭 허용
      } else {
        ipcRenderer.send("set-ignore-mouse", true); // 클릭 관통
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    // 초기값 설정
    ipcRenderer.send("set-ignore-mouse", true);

    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);
};
