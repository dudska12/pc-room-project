"use client";

import { signup } from "@/app/actions/auth";
import { useState } from "react";
import styles from "./signup.module.css"; // CSS Module 연결

interface SignupPageProps {
  onCancel?: () => void; // 부모(Login)에서 모달을 닫기 위해 내려주는 함수
}

export default function SignupPage({ onCancel }: SignupPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    try {
      const result = await signup(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        // alert("회원가입 성공! 이제 로그인해 주세요.");
        // window.location.reload();
        if (onCancel) onCancel(); // 성공 시 모달 닫기
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* 우측 상단 닫기 버튼 */}
      <button type="button" onClick={onCancel} className={styles.closeButton}>
        ✕
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Join The Azit</h1>
        <p className={styles.subtitle}>새로운 관리 시스템 계정을 생성합니다</p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        {/* 이메일 (전체 너비) */}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>이메일</label>
          <input
            name="email"
            type="email"
            placeholder="example@azit.com"
            required
            className={styles.input}
          />
        </div>

        {/* 아이디 & 이름 (반씩 차지) */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>닉네임</label>
          <input
            name="userId"
            type="text"
            placeholder="로그인 아이디"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>이름</label>
          <input
            name="name"
            type="text"
            placeholder="성함"
            required
            className={styles.input}
          />
        </div>

        {/* 비밀번호 (전체 너비) */}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className={styles.input}
          />
        </div>

        {/* 에러 메시지 */}
        {error && <div className={styles.error}>{error}</div>}

        {/* 가입 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? "REGISTERING..." : "CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  );
}
