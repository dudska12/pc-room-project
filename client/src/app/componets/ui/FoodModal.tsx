"use client";
import { useState } from "react";
import style from "./css/FoodModal.module.css";

const CATEGORIES = ["추천메뉴", "식사류", "라면류", "간식류", "음료", "커피"];

interface CartItem {
  id: string;
  name: string;
  price: number;
  count: number;
}

export default function FoodModal({ onClose }: { onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("추천메뉴");
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. 장바구니 추가
  const addToCart = (id: string, name: string, price: number) => {
    setCart((prev) => {
      const isExist = prev.find((item) => item.id === id);
      if (isExist)
        return prev.map((item) =>
          item.id === id ? { ...item, count: item.count + 1 } : item,
        );
      return [...prev, { id, name, price, count: 1 }];
    });
  };

  // 2. 수량 조절 (+, -)
  const updateCount = (id: string, amount: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCount = item.count + amount;
          return { ...item, count: newCount > 0 ? newCount : 1 }; // 최소 1개 유지
        }
        return item;
      }),
    );
  };

  // 3. 항목 삭제 (X 버튼)
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>
        <button onClick={onClose} className={style.absoluteCloseButton}>
          &times;
        </button>

        <nav className={style.categoryBar}>
          <div className={style.logo}>LOGO</div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${style.categoryBtn} ${activeCategory === cat ? style.active : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className={style.menuSection}>
          <div className={style.modalHeader}>
            <h2 className={style.headerFont}>{activeCategory}</h2>
          </div>
          <div className={style.grid}>
            {Array.from({ length: 12 }).map((_, i) => {
              const itemId = `${activeCategory}-${i}`;
              const itemName = `${activeCategory} ${i + 1}`;
              const itemPrice = 5500;
              return (
                <div
                  key={itemId}
                  className={style.menuItem}
                  onClick={() => addToCart(itemId, itemName, itemPrice)}
                >
                  <div className={style.imagePlaceholder}>📸</div>
                  <div className={style.itemInfo}>
                    <p className={style.itemName}>{itemName}</p>
                    <p className={style.itemPrice}>
                      {itemPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 오른쪽 장바구니 (수정된 부분) */}
        <aside className={style.cartSection}>
          <div className={style.cartHeader}>주문목록 ({cart.length})</div>
          <div className={style.cartList}>
            {cart.length === 0 ? (
              <p className={style.emptyMsg}>선택한 상품이 없습니다.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className={style.cartItemRow}>
                  <div className={style.cartItemTop}>
                    <span className={style.cartItemName}>{item.name}</span>
                    <button
                      className={style.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className={style.cartItemBottom}>
                    <div className={style.countControl}>
                      <button onClick={() => updateCount(item.id, -1)}>
                        -
                      </button>
                      <span>{item.count}</span>
                      <button onClick={() => updateCount(item.id, 1)}>+</button>
                    </div>
                    <span className={style.cartItemPrice}>
                      {(item.price * item.count).toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={style.cartFooter}>
            <div className={style.totalRow}>
              <span>총 금액</span>
              <span className={style.totalPrice}>
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <button
              className={style.orderBtn}
              disabled={cart.length === 0}
              onClick={() => alert("주문이 완료되었습니다!")}
            >
              주문하기
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
