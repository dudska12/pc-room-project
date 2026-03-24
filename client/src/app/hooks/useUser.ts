// src/hooks/useUser.ts
import { useState, useEffect, useCallback } from "react";

export function useUser() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
      const data = await response.json();
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 유저 정보를 수동으로 새로고침하고 싶을 때(예: 충전 후)를 위해 리프레시 함수도 반환
  return { userData, loading, error, refreshUser: fetchUser };
}
