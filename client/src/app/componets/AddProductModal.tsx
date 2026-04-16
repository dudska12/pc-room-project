"use client";

import { useState } from "react";
import style from "./ui/css/AddProductModal.module.css";
import { addProduct } from "@/app/actions/product";

export default function AddProductModal({
  onClose,
  activeCategory,
  onSuccess,
}: {
  onClose: () => void;
  activeCategory: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // 1. 폼 제출 핸들러 (서버 액션 호출)
  const handleSubmit = async (formData: FormData) => {
    if (!confirm("이 정보로 새 상품을 등록하시겠습니까?")) return;

    setIsLoading(true);
    try {
      // 폼 데이터에 현재 카테고리 수동 추가
      formData.set("category", activeCategory);

      const res = await addProduct(formData);
      if (res.success) {
        // alert("상품이 등록되었습니다!");
        onClose(); // 성공 시 모달 닫기
      } else {
        // alert(res.error || "등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("상품 등록 실패:", error);
      // alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.subModalOverlay} onClick={onClose}>
      {" "}
      {/* 바깥 클릭 시 닫기 */}
      <div
        className={style.subModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* 내부 클릭 전파 방지 */}
        <button onClick={onClose} className={style.closeButton}>
          &times;
        </button>
        <div className={style.modalHeader}>
          <h2>[{activeCategory}] 새 상품 등록</h2>
        </div>
        {/* 2. HTML5 기본 Form과 FormData 사용 */}
        <form action={handleSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label htmlFor="name">상품명</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="예: 신라면"
            />
          </div>

          <div className={style.formRow}>
            {" "}
            {/* 한 줄에 배치 */}
            <div className={style.formGroup}>
              <label htmlFor="price">가격 (원)</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                placeholder="예: 5000"
                min="0"
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="stock">초기 재고 (개)</label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                placeholder="예: 20"
                min="0"
              />
            </div>
          </div>

          <div className={style.formGroup}>
            <label htmlFor="imageUrl">
              상품 사진 URL (Supabase Storage 등)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              placeholder="이미지 주소를 입력하세요."
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="description">상품 설명 (선택)</label>
            <textarea
              id="description"
              name="description"
              placeholder="맵기 조절 가능 여부 등을 적어주세요."
              rows={3}
            ></textarea>
          </div>

          <div className={style.formFooter}>
            <button type="button" onClick={onClose} className={style.cancelBtn}>
              취소
            </button>
            <button
              type="submit"
              className={style.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "등록 중..." : "확인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
