"use client";
import { useState } from "react";
import style from "./css/FoodModal.module.css"; // 기존 스타일 유지
import { useTimeStore } from "@/store/useTimeStore"; // 시간 스토어 가져오기

type Props = {
  onClose: () => void;
};

const chargeOptions = [
  { time: "1시간", price: 1000, seconds: 3600 },
  { time: "2시간", price: 2000, seconds: 7200 },
  { time: "5시간", price: 3000, seconds: 18000 },
  { time: "10시간", price: 5000, seconds: 36000 },
  { time: "20시간", price: 10000, seconds: 72000 },
  { time: "100시간", price: 30000, seconds: 360000 },
];

export default function ChargeModal({ onClose }: Props) {
  const { timeLeft } = useTimeStore(); // 현재 남은 시간
  const [selected, setSelected] = useState<(typeof chargeOptions)[0] | null>(
    null,
  );

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div
        className={style.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 우측 상단 닫기 버튼 */}
        <button onClick={onClose} className={style.absoluteCloseButton}>
          &times;
        </button>

        {/* 1. 왼쪽 안내 바 (음식 모달의 카테고리 바 위치) */}
        <nav className={style.categoryBar}>
          <div className={style.logo}>CHARGE</div>
          <div className={style.categoryBtn + " " + style.active}>
            시간권 선택
          </div>
        </nav>

        {/* 2. 중앙 요금제 그리드 */}
        <div className={style.menuSection}>
          <div className={style.modalHeader}>
            <h2 className={style.headerFont}>요금제 선택</h2>
          </div>

          <div className={style.grid}>
            {chargeOptions.map((item, i) => (
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

        {/* 3. 오른쪽 결제 확인창 (음식 모달의 장바구니 위치) */}
        <aside className={style.cartSection}>
          <div className={style.cartHeader}>결제 정보</div>
          <div className={style.cartList}>
            {selected ? (
              <div className={style.chargeSummary}>
                <div className={style.summaryRow}>
                  <span>선택 상품</span>
                  <strong>{selected.time}</strong>
                </div>
                <div className={style.summaryRow}>
                  <span>현재 시간</span>
                  <span>{Math.floor((timeLeft ?? 0) / 360) / 10}시간</span>
                </div>
                <div className={style.summaryRow}>
                  <span>충전 후 시간</span>
                  <span className={style.blueText}>
                    {Math.floor(((timeLeft ?? 0) + selected.seconds) / 360) /
                      10}
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
            <button className={style.orderBtn} disabled={!selected}>
              충전하기
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
