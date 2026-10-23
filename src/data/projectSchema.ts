// projects.json 의 형태 정의
// 브라우저 코드와 어드민 API(vite-plugin-admin.ts, Node)가 함께 쓰므로
// Vite 전용 문법(import.meta.*)이나 DOM 의존 코드를 넣지 말 것

// 포트폴리오 분류 (순서대로 표시됨)
export const CATEGORIES = [
    { key: "product-directing", label: "Product Directing" },
    { key: "software-develop", label: "Software Develop" },
    { key: "product-develop", label: "Product Develop" },
    { key: "design", label: "Design" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

// 프로젝트 회고/블로그 글
// - slug가 있으면 어드민에서 직접 쓴 글 (본문: src/content/posts/{slug}.md, 주소: /posts/{slug})
// - 없으면 url로 연결되는 외부 글
export interface ProjectPost {
    title: string;
    url: string;
    slug: string;
    date: string;        // "YYYY-MM-DD" (없으면 "")
}

// 영어 번역. 비어 있는 항목은 한국어 원문이 그대로 표시됨
export interface ProjectTranslation {
    title: string;
    subtitle: string;
    description: string;
    joins: string;
}

export const TRANSLATED_FIELDS = ["title", "subtitle", "description", "joins"] as const;

export const emptyTranslation = (): ProjectTranslation => ({ title: "", subtitle: "", description: "", joins: "" });

// projects.json 의 한 항목. 어드민(/admin, 개발 서버 전용)에서 편집함
// title/subtitle/description/joins는 한국어 원문, en은 영어 번역
export interface ProjectRecord {
    id: string;
    title: string;
    subtitle: string;
    year: number;
    category: CategoryKey; // 포트폴리오 페이지에서 묶는 기준
    image: string;       // src/assets/portfolioimg 기준 상대 경로 (없으면 "")
    link: string;        // 있으면 카드 클릭 시 상세 대신 외부 링크로 이동
    description: string; // 줄바꿈은 <br/>
    skills: string;
    joins: string;
    pdf: string;         // public/pdf 기준 파일명 (발표자료, 없으면 "")
    posts: ProjectPost[];
    en: ProjectTranslation;
}

export interface ProjectsFile {
    main: ProjectRecord[];
    sub: ProjectRecord[];
}
