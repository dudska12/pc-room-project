# pc-room-project

pc-room-project

## 프로젝트 소개

이 프로젝트는 친구들과 만든 아지트에 pc방 분위기를 구현하기 위해 제작된 아지트 전용 pc방 프로그램입니다

실제 PC방처럼 **시간 관리, 회원 시스템, UI 경험**을 제공하여  
아지트에서도 몰입감 있는 환경을 즐길 수 있도록 설계되었습니다.

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 .env 파일을 생성하고 아래 값을 입력하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_prisma_database_url
```

### 3. 개발 모드 실행

# Next.js 서버 실행

```Terminal.1
npm run dev
```

# Electron 실행

```Terminal.2
npm run electron
```

## 기술 스택

# FE

- Next.js (App Router)
- React
- Electron

# BE & DB

- Supabase (Auth + Realtime DB)
- Prisma

# 상태 관리 & 보안

- Zustand
- bcrypt

# 개발 도구

- TypeScript
- electron-builder
- dotenv

## 주요 기능

# 1. 회원 관리 시스템

- 아지트 전용 회원가입 (아이디/비밀번호 생성)
- bcrypt 기반 비밀번호 암호화
- Supabase Auth를 통한 로그인 유지

# 2. 실시간 시간 관리

- 로그인 시 잔여 시간 자동 차감
- 앱 종료 후에도 시간 데이터 유지
- 시간 0 시 자동 차단 및 안내

# 3. PC방 감성 UI

- 사용자 남은 시간 상단 고정 표시
- 다크 모드 기반 네온 사이버 테마 UI
- 실제 PC방 느낌의 몰입형 인터페이스

# 4. 아지트 편의 기능

- 음식 및 서비스 주문 기능
- 시간 충전 시스템

## 🧠 회고

이번 프로젝트는 **Next.js + Supabase + Prisma 기반 웹 서비스로 시작하여,  
최종적으로 Electron을 통해 데스크톱 앱으로 확장**하는 것을 목표로 진행했습니다.

### ✅ 개발 과정

초기 웹 개발 단계에서는 기존에 익숙한 스택을 사용했기 때문에 큰 문제 없이 진행되었습니다.  
Supabase는 처음 사용해보는 기술이었지만, 시행착오를 겪으며 최종적으로 웹 기능은 모두 구현할 수 있었습니다.

---

### ❗ 아쉬웠던 점

#### 1. Electron 적용 과정에서의 문제

- Electron을 후반에 붙이면서 예상하지 못한 문제가 발생
  - 클릭이 동작하지 않는 이슈
  - Next.js `page` 구조에서 렉 발생
- 특히 페이지 단위 구조가 Electron 환경에서 성능 저하를 유발

👉 컴포넌트 단위 구조로 리팩토링하면 개선될 여지가 있었지만  
데드라인으로 인해 적용하지 못함

---

#### 2. 시간 동기화 로직 문제

- 초기에는 1초 단위로 서버에 요청 → **과도한 API 호출 발생**
- 이후 1분 단위로 변경했지만,  
  setInterval 기반 구현에서 **딜레이 누적으로 오차 발생 (58~62초)**

👉 해결:

- 단순 카운트 방식이 아니라  
  **현재 시간을 기준으로 계산하는 방식으로 변경하여 해결**

---

#### 3. Electron + 서버 구조에 대한 이해 부족

- Electron 환경에서도 기존 웹 서버 구조를 그대로 사용할 수 있을 것으로 생각했으나,
- 실제 배포(.exe) 환경에서는 **로컬 중심 구조 설계 필요성**을 뒤늦게 인지

👉 기존 API 구조를 전면 수정해야 하는 상황이 되어  
현실적으로 프로젝트 범위를 넘어선다고 판단하고 마무리

---

### 🔍 배운 점

- Electron은 후반에 붙이는 것이 아니라  
  **초기 설계부터 고려해야 한다는 점**
- 시간 관련 로직은  
  → “카운트”보다 “기준 시간 계산”이 더 안정적이라는 것
- 서버 상태와 클라이언트 상태를 명확히 분리해야 함
- 단순 구현보다 **실행 환경(웹 vs 데스크톱)**을 먼저 고려하는 설계가 중요

---

### 🚀 개선 방향

- Electron은 단순 wrapper로 두고 웹 중심 구조 유지
- 시간 계산은 서버 기준으로 단일화
- Next.js 구조를 페이지 중심이 아닌 컴포넌트 중심으로 리팩토링
- 데스크톱 배포를 고려한 아키텍처 재설계 (로컬 + 서버 역할 분리)

## 📸 실행 화면 (Screenshots)

### 🖥️ 메인 화면

![로그인화면](/readmeImage/pc방로그인화면.png)
![로그인 후 화면](/readmeImage/pc로그인했을때.png)

### ⏱️ 로그인 UI / 회원가입

![회원가입](/readmeImage/회원가입.png)
![당번표](/readmeImage/당번표UI.png)

### 🔐 요금제 음식 UI

![요금제선택](/readmeImage/요금제선택시.png)
![음식창 모달](/readmeImage/음식모달창.png)

### 🍜 주문 관리

![새상품등록](/readmeImage/새상품등록.png)
![재고관리](/readmeImage/재고관리.png)
