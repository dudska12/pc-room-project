"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 상품 추가 (장 봐온 물건 등록)
export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock")) || 0;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  try {
    await prisma.product.create({
      data: {
        name,
        category,
        price,
        stock,
        description,
        imageUrl,
        isAvailable: true,
      },
    });

    revalidatePath("/admin/products"); // 관리자 페이지 갱신
    revalidatePath("/order"); // 사용자 주문 페이지 갱신
    return { success: true };
  } catch (error) {
    console.error("상품 등록 에러:", error);
    return { success: false, error: "상품 등록 실패" };
  }
}

// 2. 상품 삭제
export async function deleteProduct(productId: number) {
  // 스키마가 Int형이므로 number로 받음
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("상품 삭제 에러:", error);
    return { success: false, error: "삭제 실패" };
  }
}

export async function updateProductStock(id: number, amount: number) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: {
          // increment는 양수면 더하고, 음수면 자동으로 뺍니다.
          increment: amount, 
        },
      },
    });

    // 재고가 0 미만으로 내려가지 않게 방어 로직 (선택 사항)
    if (updatedProduct.stock < 0) {
      await prisma.product.update({
        where: { id },
        data: { stock: 0 },
      });
    }

    revalidatePath("/"); // 메인 페이지 UI 갱신 (캐시 무효화)
    return { success: true };
  } catch (error) {
    console.error("재고 수정 에러:", error);
    return { success: false, error: "재고를 수정하지 못했습니다." };
  }
}