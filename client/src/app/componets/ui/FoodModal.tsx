"use client";

import { useState } from "react";
import style from "./css/FoodModal.module.css";
import ConfirmModal from "./ConfirmModal";
import { useOrder } from "@/app/hooks/useOrder";
import { deleteProduct, updateProductStock } from "@/app/actions/product";
import AddProductModal from "../AddProductModal";
import { useProducts } from "@/app/hooks/useProducts";

const CATEGORIES = [
  "추천메뉴",
  "식사류",
  "라면류",
  "간식류",
  "음료",
  "커피",
  "재고관리",
];

export default function FoodModal({
  onClose,
  user,
}: {
  onClose: () => void;
  user: any;
}) {
  const [activeCategory, setActiveCategory] = useState("추천메뉴");
  const [cart, setCart] = useState<any[]>([]); // 타입을 any로 완화
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 훅에서 데이터 가져오기
  const { products, isLoading: isProductsLoading, refresh } = useProducts();
  const { sendOrder, isLoading: isOrderLoading } = useOrder();

  // 장바구니 추가
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

  const updateCount = (id: string, amount: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCount = item.count + amount;
          return { ...item, count: newCount > 0 ? newCount : 1 };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  const handleFinalConfirm = async () => {
    console.log(user);

    const result = await sendOrder({
      userId: user.id, // User 테이블의 PK (UUID)
      seatNumber: user.currentSeat?.seatNumber || 0, // Seat 테이블의 번호
      items: cart,
      totalPrice: totalAmount,
    });

    if (result.success) {
      // alert("주문이 완료되었습니다!");
      setCart([]);
      setIsConfirmOpen(false);
      refresh(); // 만약 상품 재고를 즉시 갱신하고 싶다면 useProducts의 refresh 호출
    }
  };

  const handleDeleteProduct = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("이 상품을 아예 삭제하시겠습니까?")) {
      const res = await deleteProduct(id);
      if (res.success) {
        refresh(); // 삭제 후 목록 갱신
      }
    }
  };

  const handleUpdateStock = async (id: number, amount: number) => {
    // 1. 서버 액션 호출 (재고 수정용 액션 필요)
    const res = await updateProductStock(id, amount);

    if (res.success) {
      refresh(); // useProducts의 refresh를 호출해 화면 갱신
    }
  };

  const handleAddProductClick = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>
        <button onClick={onClose} className={style.absoluteCloseButton}>
          &times;
        </button>

        <nav className={style.categoryBar}>
          <div className={style.logo}>AZIT</div>
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
            {/* 🔥 여기서부터 교체 시작 */}
            {activeCategory === "재고관리" ? (
              // 1. [재고관리 모드] 카테고리 상관없이 전체 상품 나열
              products?.map((product: any) => (
                <div key={product.id} className={style.inventoryCard}>
                  <div className={style.inventoryInfo}>
                    <span className={style.categoryTag}>
                      {product.category}
                    </span>
                    <p className={style.itemName}>
                      {product.name} ({product.price.toLocaleString()}원)
                    </p>
                  </div>

                  <div className={style.stockControl}>
                    <button
                      onClick={() => handleUpdateStock(product.id, -1)}
                      className={style.stockBtn}
                    >
                      -
                    </button>
                    <span
                      className={
                        product.stock === 0 ? style.outOfStock : style.stockNum
                      }
                    >
                      {product.stock}개
                    </span>
                    <button
                      onClick={() => handleUpdateStock(product.id, 1)}
                      className={style.stockBtn}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // 2. [일반 메뉴 모드] 기존 로직 (카테고리 필터링 + 상품 추가 버튼)
              <>
                {products
                  ?.filter((p: any) => p.category === activeCategory)
                  .map((product: any) => {
                    // 재고 0인 상품 처리 (선택 사항)
                    const isSoldOut = product.stock <= 0;

                    return (
                      <div
                        key={product.id}
                        className={`${style.menuItem} ${isSoldOut ? style.soldOut : ""}`}
                        onClick={() =>
                          !isSoldOut &&
                          addToCart(
                            product.id.toString(),
                            product.name,
                            product.price,
                          )
                        }
                      >
                        {/* 상품 삭제 버튼 (오른쪽 상단) */}
                        <button
                          className={style.removeBtn}
                          onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 방지
                            handleDeleteProduct(e, product.id);
                          }}
                        >
                          &times;
                        </button>

                        {/* 상품 이미지 */}
                        <div className={style.imagePlaceholder}>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{
                                filter: isSoldOut
                                  ? "grayscale(100%) opacity(0.5)"
                                  : "none",
                              }}
                            />
                          ) : (
                            "📸"
                          )}
                          {isSoldOut && (
                            <div className={style.soldOutLabel}></div>
                          )}
                        </div>

                        {/* 상품 정보 */}
                        <div className={style.itemInfo}>
                          <p className={style.itemName}>{product.name}</p>
                          <p className={style.itemPrice}>
                            {product.price.toLocaleString()}원
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: isSoldOut ? "#ff4d4f" : "#666",
                              fontWeight: isSoldOut ? "bold" : "normal",
                            }}
                          >
                            재고: {product.stock}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                {/* 상품 추가 버튼 카드는 일반 모드에서만 보이게 유지 */}
                <div
                  className={`${style.menuItem} ${style.addCard}`}
                  onClick={handleAddProductClick}
                >
                  <div className={style.addIcon}>+</div>
                  <p className={style.addText}>상품 추가</p>
                </div>
              </>
            )}
          </div>
        </div>

        <aside className={style.cartSection}>
          {/* ... 장바구니 리스트 로직 (동일) ... */}
          <div className={style.cartHeader}>주문목록 ({cart.length})</div>
          <div className={style.cartList}>
            {cart.map((item) => (
              <div key={item.id} className={style.cartItemRow}>
                <div className={style.cartItemTop}>
                  <span className={style.cartItemName}>{item.name}</span>
                  <button
                    className={style.cartItemRemoveBtn}
                    onClick={() => removeItem(item.id)}
                  >
                    &times;
                  </button>
                </div>
                <div className={style.cartItemBottom}>
                  <div className={style.countControl}>
                    <button onClick={() => updateCount(item.id, -1)}>-</button>
                    <span>{item.count}</span>
                    <button onClick={() => updateCount(item.id, 1)}>+</button>
                  </div>
                  <span className={style.cartItemPrice}>
                    {(item.price * item.count).toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className={style.cartFooter}>
            <div className={style.totalRow}>
              <span className={style.BlackFont}>총 금액</span>
              <span className={style.totalPrice}>
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <button
              className={style.orderBtn}
              onClick={() => setIsConfirmOpen(true)}
            >
              주문하기
            </button>
          </div>
        </aside>

        {isAddModalOpen && (
          <AddProductModal
            onClose={() => setIsAddModalOpen(false)}
            activeCategory={activeCategory}
            // onSuccess 에러가 나면 AddProductModal 파일에서 props에 onSuccess: () => void 추가해줘야 함
            onSuccess={refresh}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmOpen}
          totalPrice={totalAmount}
          onConfirm={handleFinalConfirm}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
