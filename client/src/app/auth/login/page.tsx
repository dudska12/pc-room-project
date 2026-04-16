"use client";

import { useState, useActionState } from "react";
import { login } from "@/app/actions/login";
import SignupPage from "@/app/signup/page";
import Image from "next/image"; // Next.js 이미지 컴포넌트 사용 추천
import styles from "./login.module.css";
import { getDutyScheduleData, getMonthScheduleData } from "@/utils/duty";
import { useMouseIgnore } from "@/app/hooks/useMouseIgnore";
import imagelogo from "@/images/backgroundPcImage.jpg";

export default function LoginPage() {
  useMouseIgnore(); // 2. 실행
  const [state, formAction, isPending] = useActionState(login, null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const dutySchedule = getDutyScheduleData(4);
  const { year, month, schedule } = getMonthScheduleData(); // 한 달 데이터
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  return (
    <div className={`${styles.wrapper} panel-container`}>
      <div className={styles.container}>
        {/* ====== 왼쪽: 이미지 영역 ====== */}
        <div className={styles.leftSection}>
          {/* ✅ 남영님이 원하는 사진을 여기에 넣으세요! */}
          <Image
            src={imagelogo}
            alt="Azit PC Branding"
            fill // 부모 컨테이너에 맞춤
            priority // 우선 로딩
            className={styles.brandingImage}
          />

          <div className={styles.brandingText}>
            <p className="text-white text-sm font-bold">WELCOME TO</p>
            <h1 className={styles.title}>사무실 프로그램</h1>
            <p className="text-slate-400 text-xs">
              2026년 3월 18일 ~ 2027년 3월 18일의 여정
            </p>
          </div>
        </div>

        {/* ====== 오른쪽: 정보 영역 ====== */}
        <div className={styles.rightSection}>
          <div className={styles.noticeCardGrid}>
            <div className={styles.cardHeader}>
              <span>📢</span> 오늘의 시스템 당번 스케줄
              {/* ✅ 전체보기 버튼 추가 */}
              <button
                className={styles.viewAllBtn}
                onClick={() => setIsCalendarOpen(true)}
              >
                전체 일정 보기
              </button>
            </div>

            <div className={styles.cardList}>
              {dutySchedule.map((data, index) => (
                <div
                  key={index}
                  className={`${styles.dutyCard} ${data.isToday ? styles.isToday : ""}`}
                >
                  <div className={styles.dateNumber}>
                    <h2>{data.dayNumber}</h2>
                  </div>
                  <div className={styles.dutyName}>
                    <p>{data.todayDuty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 로그인 카드 (우측 하단) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>로그인</div>

            <form action={formAction} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@azit.com"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={styles.input}
                />
              </div>

              {state?.error && (
                <div className={styles.error}>{state.error}</div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className={styles.submitButton}
              >
                {isPending ? "SYSTEM ACCESSING..." : "SYSTEM ACCESS"}
              </button>
            </form>

            {/* 회원가입 트리거 */}
            <button
              onClick={() => setIsSignupOpen(true)}
              className={styles.signupTrigger}
            >
              계정이 없으신가요? <span>회원가입 요청</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 한 달 당번표 모달 */}
      {isCalendarOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsCalendarOpen(false)}
        >
          <div
            className={styles.container}
            style={{
              maxWidth: "600px",
              height: "auto",
              flexDirection: "column",
              padding: "30px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.calendarHeader}>
              <h2 className={styles.title} style={{ fontSize: "1.5rem" }}>
                {year}년 {month}월 당번표
              </h2>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.calendarGrid}>
              {schedule.map((day, i) => (
                <div
                  key={i}
                  className={`${styles.calendarDay} ${day.isToday ? styles.isToday : ""}`}
                >
                  <span className={styles.dayNum}>
                    {day.date}({day.dayName})
                  </span>
                  <span className={styles.dutyNameSmall}>{day.duty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {isSignupOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsSignupOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SignupPage onCancel={() => setIsSignupOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
