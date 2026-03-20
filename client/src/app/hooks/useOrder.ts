"use client";
import { useState } from "react";

interface OrderData {
  items: any[];
  totalPrice: number;
  tableNumber: string;
}

export function useOrder() {
  const [isLoading, setIsLoading] = useState(false);

  const sendOrder = async (orderData: OrderData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("주문 전송 실패");

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("Order Error:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOrder, isLoading };
}
