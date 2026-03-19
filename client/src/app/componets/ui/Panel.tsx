"use client";
import { useState } from "react";
import TimeBox from "./TimeBox";
import MenuButtons from "./MenuButtons";
import FoodModal from "./FoodModal";
import ChargeModal from "./ChargeModal";
import style from "./css/Panel.module.css";

export default function Panel() {
  const [open, setOpen] = useState<null | "charge" | "food">(null);

  return (
    <div>
      <div className={style.Panel}>
        {/* 상단 런처 헤더 부분 추가 */}
        <div className={style.topBar}>
          <span
            style={{ fontSize: "12px", color: "#00d2ff", fontWeight: "bold" }}
          >
            NY-MANAGER
          </span>
          <button className={style.topButton}>사용종료</button>
        </div>

        {/* 기존 컴포넌트들 */}
        <TimeBox />

        {/* 중간에 광고나 안내 문구 영역이 있으면 더 PC방 같습니다 */}
        <div
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "13px",
          }}
        >
          이벤트: 신규 메뉴 '치즈라볶이' 출시!
        </div>

        <MenuButtons onOpen={setOpen} />
      </div>

      {open === "charge" && <ChargeModal onClose={() => setOpen(null)} />}
      {open === "food" && <FoodModal onClose={() => setOpen(null)} />}
    </div>
  );
}
