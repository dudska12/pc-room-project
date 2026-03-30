// src/app/componets/ui/LockoutGuard.tsx
"use client";
import { useLockout } from "@/app/hooks/useLockout";
import ChargeModal from "./ChargeModal";

interface Props {
  userData: any;
  children: React.ReactNode;
  refreshUser: () => Promise<void>;
}

export default function TimeGuard({ userData, children, refreshUser }: Props) {
  const { timeLeft, isLocked } = useLockout(
    userData.remainingTime,
    userData.id,
  );

  // 1. 아직 시간이 설정되지 않은 경우 (null) 로딩 표시
  if (timeLeft === null) return <div>시간 데이터 확인 중...</div>;

  // 2. 시간이 0이거나 잠금 상태인 경우
  if (isLocked || timeLeft <= 0) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
        <div className="text-center text-white p-8 bg-gray-900 border-2 border-red-600 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-black mb-4 text-red-600 uppercase">
            Time Out
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            잔여 시간이 없습니다. 충전 후 이용해 주세요.
          </p>
          <ChargeModal
            userId={userData.id}
            onClose={() => alert("충전 후 이용 가능합니다.")}
            refreshUser={refreshUser}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
