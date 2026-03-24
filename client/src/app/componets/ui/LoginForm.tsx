"use client";

import { useActionState } from "react"; // React 19 기준, 이전 버전은 'react-dom'의 useFormState
import { login } from "@/app/actions/login";

export default function LoginForm() {
  // state: 액션이 반환한 값, formAction: form에 연결할 함수
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input name="email" type="email" placeholder="이메일" required />
      <input name="password" type="password" placeholder="비밀번호" required />

      {/* 에러가 있을 경우 화면에 표시 */}
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-500 text-sm">로그인 성공!</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 disabled:bg-gray-500 p-2 rounded"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
