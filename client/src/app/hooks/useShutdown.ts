import { terminateSession } from "@/app/actions/logout";
import { useTimeStore } from "@/store/useTimeStore";

export function useShutdown(userData: any) {
  const { timeLeft } = useTimeStore();

  const shutdown = async () => {
    if (!userData || timeLeft === null) return;
    if (confirm("사용을 종료하시겠습니까?")) {
      await terminateSession(userData.id, timeLeft);
    }
  };

  return { shutdown };
}