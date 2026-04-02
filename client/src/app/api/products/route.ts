import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc", // 최신 등록순으로 가져오기
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("상품 로드 API 에러:", error);
    return NextResponse.json(
      { error: "데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
