"use client";

import { useState, useEffect } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 상품 목록 불러오기 함수
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // API Route를 하나 만들어서 데이터를 가져오는 방식이 가장 깔끔합니다.
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("상품 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. 외부에서 수동으로 갱신할 수 있게 fetchProducts도 같이 내보냅니다.
  return { products, isLoading, refresh: fetchProducts };
}