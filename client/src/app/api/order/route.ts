import { NextResponse } from "next/server";

let orders: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalPrice, tableNumber } = body;

    // 주문 데이터 구성
    const newOrder = {
      id: Date.now(),
      items,
      totalPrice,
      tableNumber: tableNumber || "1번 자리", // 일단 임시
      status: "pending", // 주문 대기 상태
      createdAt: new Date(),
    };

    // 서버 터미널에 로그 출력 (작동 확인용)
    console.log("새로운 주문 발생!!:", newOrder);

    orders.push(newOrder);

    return NextResponse.json(
      { message: "주문 성공!", order: newOrder },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "주문 실패" }, { status: 500 });
  }
}

// 관리자 페이지에서 주문 목록을 가져올 때 사용할 GET 메서드
export async function GET() {
  return NextResponse.json(orders);
}
