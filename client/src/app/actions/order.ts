"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendOrder(orderData: {
  userId: string;       // 스키마에 필수
  seatNumber: number;   // 스키마에 필수
  items: any[];
  totalPrice: number;
}) {
  try {
    // 트랜잭션: 주문 생성과 재고 차감을 한 번에 처리 (하나라도 실패하면 롤백)
    await prisma.$transaction(async (tx) => {
      // 1. 주문 생성 (Order & OrderItem)
      await tx.order.create({
        data: {
          userId: orderData.userId,
          seatNumber: orderData.seatNumber,
          totalPrice: orderData.totalPrice,
          // OrderItem 생성 (스키마 관계 설정에 따름)
          items: {
            create: orderData.items.map((item) => ({
              productId: Number(item.id),
              quantity: item.count,
            })),
          },
        },
      });

      // 2. 재고 차감 (Product 모델의 stock 필드 업데이트)
      for (const item of orderData.items) {
        await tx.product.update({
          where: { id: Number(item.id) },
          data: {
            stock: {
              decrement: item.count, // 주문 수량만큼 감소
            },
          },
        });
      }
    });

    revalidatePath("/"); // 메인 페이지 UI 갱신
    return { success: true };
  } catch (error) {
    console.error("주문 처리 실패:", error);
    return { success: false, error: "주문 처리 중 오류가 발생했습니다." };
  }
}