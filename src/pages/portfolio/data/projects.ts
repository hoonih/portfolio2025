import projectsJson from "./projects.json";

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

// projects.json 의 한 항목. 어드민(/admin, 개발 서버 전용)에서 편집함
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
}

export interface ProjectsFile {
    main: ProjectRecord[];
    sub: ProjectRecord[];
}

// 화면에서 쓰는 형태 (image가 실제 URL로 변환됨)
export interface Project extends Omit<ProjectRecord, "image" | "link" | "pdf"> {
    image?: string;
    link?: string;
    pdf?: string;        // 실제 URL
}

export const pdfUrl = (fileName: string) => `${import.meta.env.BASE_URL}pdf/${fileName}`;

const imageUrls = import.meta.glob<string>(
    "../../../assets/portfolioimg/**/*.{png,jpg,jpeg,webp,gif}",
    { eager: true, import: "default" },
);

const resolveImage = (path: string) =>
    path ? imageUrls[`../../../assets/portfolioimg/${path}`] : undefined;

const toProject = (record: ProjectRecord): Project => ({
    ...record,
    image: resolveImage(record.image),
    link: record.link || undefined,
    pdf: record.pdf ? pdfUrl(record.pdf) : undefined,
});

const data = projectsJson as ProjectsFile;

export const mainPortfolioData: Project[] = data.main.map(toProject);
export const subPortfolioData: Project[] = data.sub.map(toProject);

// 직접 쓴 글의 메타데이터와 소속 프로젝트 찾기
export const findPost = (slug: string) => {
    for (const project of [...mainPortfolioData, ...subPortfolioData]) {
        const post = project.posts.find(p => p.slug === slug);
        if (post) return { post, project };
    }
    return null;
};
