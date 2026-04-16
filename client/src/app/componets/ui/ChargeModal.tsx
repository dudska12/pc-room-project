"use client";
import { useState } from "react";
import style from "./css/FoodModal.module.css";
import { useTimeStore } from "@/store/useTimeStore";
import ConfirmModal from "./ConfirmModal";
import { chargeTime } from "@/app/actions/time"; // 액션 경로 확인 필수!
import { CHARGE_OPTIONS } from "@/app/Constants/chargeOptions";

type Props = {
  userId: string;
  onClose: () => void;
  refreshUser: () => Promise<void>;
};

export default function ChargeModal({ userId, onClose, refreshUser }: Props) {
  const { timeLeft, setTime } = useTimeStore();

  // ✅ 상태 타입을 상수의 한 요소 타입으로 지정해서 any 에러 방지
  const [selected, setSelected] = useState<(typeof CHARGE_OPTIONS)[0] | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleFinalCharge = async () => {
    // selected가 없거나 seconds가 없을 경우를 대비한 방어 코드
    if (!selected || isPending) return;

    // 만약 constants에 seconds가 없다면 여기서 계산 (1시간 = 3600초)
    // 숫자가 포함된 문자열(예: "5시간")에서 숫자만 추출하는 로직
    const hourValue = parseInt(selected.time.replace(/[^0-9]/g, ""));
    const secondsToAdd = hourValue * 3600;

    setIsPending(true);

    try {
      const result = await chargeTime(userId, selected.price, secondsToAdd);

      if (result.success) {
        setTime(result.newTime);

        // alert(`${selected.time} 충전이 완료되었습니다!`);
        await refreshUser();
        onClose();
      } else {
        // alert(result.error || "충전 실패");
      }
    } catch (error) {
      // alert("서버 통신 오류");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div
        className={style.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={style.absoluteCloseButton}>
          &times;
        </button>

        <nav className={style.categoryBar}>
          <div className={style.logo}>CHARGE</div>
          <div className={`${style.categoryBtn} ${style.active}`}>
            시간권 선택
          </div>
        </nav>

        <div className={style.menuSection}>
          <div className={style.modalHeader}>
            <h2 className={style.headerFont}>요금제 선택</h2>
          </div>
          <div className={style.grid}>
            {/* ✅ constants에서 가져온 CHARGE_OPTIONS 사용 */}
            {CHARGE_OPTIONS.map((item, i) => (
              <div
                key={i}
                className={`${style.menuItem} ${selected?.time === item.time ? style.selectedCard : ""}`}
                onClick={() => setSelected(item)}
              >
                <div className={style.imagePlaceholder}>⏱️</div>
                <div className={style.itemInfo}>
                  <p className={style.itemName}>{item.time}</p>
                  <p className={style.itemPrice}>
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className={style.cartSection}>
          <div className={style.cartHeader}>결제 정보</div>
          <div className={style.cartList}>
            {selected ? (
              <div className={style.chargeSummary}>
                <div className={style.summaryRow}>
                  <span>선택 상품</span>
                  <strong>{selected.time}</strong>
                </div>
                {/* 시간 계산 표시 로직 (초 데이터가 상수에 없을 경우 대비) */}
                <div className={style.summaryRow}>
                  <span>충전 후 시간</span>
                  <span className={style.blueText}>
                    {Math.floor(
                      ((timeLeft ?? 0) + parseInt(selected.time) * 3600) / 3600,
                    )}
                    시간
                  </span>
                </div>
              </div>
            ) : (
              <p className={style.emptyMsg}>요금제를 선택해주세요.</p>
            )}
          </div>

          <div className={style.cartFooter}>
            <div className={style.totalRow}>
              <span className={style.headerFont}>결제 금액</span>
              <span className={style.totalPrice}>
                {selected ? selected.price.toLocaleString() : 0}원
              </span>
            </div>
            <button
              className={style.orderBtn}
              disabled={!selected || isPending}
              onClick={() => setIsConfirmOpen(true)}
            >
              {isPending ? "처리 중..." : "충전하기"}
            </button>
          </div>
        </aside>

        <ConfirmModal
          isOpen={isConfirmOpen}
          totalPrice={selected?.price || 0}
          onConfirm={handleFinalCharge}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
