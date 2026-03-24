// src/app/componets/ui/TimeGuard.tsx
"use client";
import ChargeModal from "./ChargeModal";

interface Props {
  userData: any;
  children: React.ReactNode;
  refreshUser: () => Promise<void>;
}

export default function TimeGuard({ userData, children, refreshUser }: Props) {
  // ✅ 시간이 0 이하인 경우 메인 UI 대신 충전 모달만 렌더링
  if (userData && userData.remainingTime <= 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <h2 style={{ marginBottom: "20px" }}>잔여 시간이 없습니다.</h2>
          <p style={{ marginBottom: "30px" }}>
            서비스 이용을 위해 시간을 충전해주세요.
          </p>
          {/* onClose를 막거나 안내 메시지를 띄우는 처리를 추가할 수 있습니다. */}
          <ChargeModal
            userId={userData.id}
            onClose={() => alert("충전 후 이용 가능합니다.")}
            refreshUser={refreshUser}
          />
        </div>
      </div>
    );
  }

  // ✅ 시간이 있는 경우에만 원래 보여주려던 화면(children)을 보여줌
  return <>{children}</>;
}
