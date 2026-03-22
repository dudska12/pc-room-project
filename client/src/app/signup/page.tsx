// app/signup/page.tsx
"use client";

import { signup } from "@/app/actions/auth";
import { useState } from "react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      alert("회원가입 성공! 로그인해 주세요.");
      // 성공 후 로그인 페이지로 이동하거나 로직 처리
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">아지트 회원가입</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="이메일 (인증용)"
          required
          className="p-2 border rounded"
        />
        <input
          name="userId"
          type="text"
          placeholder="아이디 (PC방 로그인용)"
          required
          className="p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          className="p-2 border rounded"
        />
        <input
          name="name"
          type="text"
          placeholder="이름"
          required
          className="p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
