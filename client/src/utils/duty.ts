// src/utils/duty.ts

export interface DutyCardData {
  dayNumber: string; // "24", "25", "26"
  dateString: string; // "2026.03.24" (옵션)
  todayDuty: string; // "태상", "윤호"
  isToday: boolean; // 오늘 카드인지 여부
}

export const getDutyScheduleData = (count = 4): DutyCardData[] => {
  const staff = ["남영", "수빈", "윤호", "태상"]; // 로테이션 멤버
  const schedule: DutyCardData[] = [];

  for (let i = 0; i < count; i++) {
    // 오늘부터 i일 후 날짜 계산
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);

    // 날짜 및 올해의 일 수 계산 (UTC 고려)
    const kstTarget = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);

    // 로테이션 인덱스 계산 (UTC 기준 날짜로 계산하는 게 오차를 줄임)
    const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
    const diff = targetDate.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // 당번 이름 및 정보 구성
    schedule.push({
      dayNumber: targetDate.getDate().toString(), // 큰 숫자
      dateString: `${targetDate.getFullYear()}.${String(targetDate.getMonth() + 1).padStart(2, "0")}.${String(targetDate.getDate()).padStart(2, "0")}`,
      todayDuty: staff[dayOfYear % staff.length], // 당번 이름
      isToday: i === 0, // 첫 번째 카드가 오늘
    });
  }

  return schedule;
};

export const getMonthScheduleData = () => {
  const staff = ["남영", "수빈", "윤호", "태상"];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 이번 달의 첫 날과 마지막 날 계산
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const schedule = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const targetDate = new Date(year, month, i);

    // 로테이션 인덱스 계산 (올해의 몇 번째 날인지 기반)
    const startOfYear = new Date(year, 0, 0);
    const diff = targetDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    schedule.push({
      date: i,
      dayName: ["일", "월", "화", "수", "목", "금", "토"][targetDate.getDay()],
      duty: staff[dayOfYear % staff.length],
      isToday: i === today.getDate() && month === today.getMonth(),
      isWeekend: targetDate.getDay() === 0 || targetDate.getDay() === 6,
    });
  }

  return { year, month: month + 1, schedule };
};
