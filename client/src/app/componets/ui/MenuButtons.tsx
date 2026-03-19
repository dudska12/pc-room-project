"use client";

import style from "./css/MenuButtons.module.css";
type Props = {
  onOpen: (type: "charge" | "food") => void;
};

export default function MenuButtons({ onOpen }: Props) {
  return (
    <div className={style.menuButtons}>
      <button className={style.menuBtn} onClick={() => onOpen("charge")}>
        <span className={style.icon}>💳</span>
        <span>요금 충전</span>
      </button>
      <button className={style.menuBtn} onClick={() => onOpen("food")}>
        <span className={style.icon}>🍔</span>
        <span>음식 주문</span>
      </button>
    </div>
  );
}
