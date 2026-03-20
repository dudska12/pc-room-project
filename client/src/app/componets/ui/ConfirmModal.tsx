"use client";
import React from "react";
import style from "./css/FoodModal.module.css"; // 기존 스타일 시트 활용

interface ConfirmModalProps {
  isOpen: boolean;
  totalPrice: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  totalPrice,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null; // 열려있지 않으면 아무것도 렌더링하지 않음

  return (
    <div className={style.confirmOverlay}>
      <div className={style.confirmBox}>
        <div className={style.confirmHeader}>
          <h3>주문 확인</h3>
        </div>
        <div className={style.confirmContent}>
          <p>선택하신 메뉴를 주문하시겠습니까?</p>
          <p className={style.confirmTotal}>
            총 결제 금액: <span>{totalPrice.toLocaleString()}원</span>
          </p>
        </div>
        <div className={style.confirmButtons}>
          <button onClick={onCancel} className={style.cancelBtn}>
            취소
          </button>
          <button onClick={onConfirm} className={style.submitBtn}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}
