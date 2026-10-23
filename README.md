# portfolio2025

React 19 + TypeScript + Vite + styled-components 로 만든 개인 포트폴리오 사이트.

```bash
yarn          # 의존성 설치 (lockfile: yarn.lock)
yarn dev      # 개발 서버 — /admin 에서 프로젝트·글 편집 가능
yarn build    # 타입 체크 + 빌드
yarn lint
```

## 구조

```
src/
├─ routes/index.tsx        라우트 정의 (Layout 아래 페이지들 + 개발용 /admin)
├─ components/             여러 페이지가 함께 쓰는 컴포넌트
│  ├─ Layout.tsx           헤더 1회 렌더링 + 페이지 이동 시 스크롤 초기화
│  ├─ Header.tsx           고정 헤더. 높이를 CSS 변수 --header-height 로 노출
│  └─ MarkdownView.tsx
├─ data/                   콘텐츠 (화면 코드와 분리)
│  ├─ profile.ts           경력·수상·스킬·연락처
│  ├─ projects.json        프로젝트 목록 — /admin 에서 편집
│  ├─ projectSchema.ts     projects.json 타입 + 분류 목록 (어드민 API와 공유, 순수 TS만)
│  └─ projects.ts          projects.json 로드 + 이미지/PDF URL 변환
├─ hooks/                  공용 훅
├─ utils/                  순수 함수 (날짜·URL 포맷 등)
├─ styles/                 GlobalStyle, 반응형 breakpoint
└─ pages/
   ├─ introduce/           "/"        ProfileSection + BannerSection
   ├─ portfolio/           "/portfolio" 카테고리별 프로젝트 + 상세 모달
   ├─ connect/             "/connect"
   ├─ post/                "/posts/:slug" 직접 쓴 회고 글 (src/content/posts/*.md)
   └─ admin/               "/admin" 개발 서버 전용 편집기 (vite-plugin-admin.ts 가 API 제공)
```

### 규칙

- 페이지 상단 여백은 `padding-top: var(--header-height)` 로 맞춘다. 헤더 높이를 props로 넘기지 않는다.
- 문구·목록 같은 콘텐츠는 `src/data` 에 두고 컴포넌트는 표시만 담당한다.
- 페이지 폴더 안은 `sections/`(페이지를 이루는 큰 덩어리)와 `components/`(그 안의 부품)로 나눈다.
