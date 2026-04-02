"use client";
import { useState } from "react";
import { sendOrder as sendOrderAction } from "@/app/actions/order"; // 서버 액션 import

// 1. 스키마에 맞춰서 인터페이스 수정 (중요!)
interface OrderData {
  userId: string;     // UUID (String)
  seatNumber: number; // Int
  items: any[];
  totalPrice: number;
}

export function useOrder() {
  const [isLoading, setIsLoading] = useState(false);

  const sendOrder = async (orderData: OrderData) => {
    setIsLoading(true);
    try {
      // 2. fetch 대신 서버 액션을 직접 호출합니다.
      const result = await sendOrderAction(orderData);

      if (!result.success) {
        throw new Error(result.error || "주문 전송 실패");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Order Error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOrder, isLoading };
}