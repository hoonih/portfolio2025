import projectsJson from "./projects.json";
import type { ProjectRecord, ProjectsFile } from "./projectSchema.ts";

// 화면에서 쓰는 형태 (image가 실제 URL로 변환됨)
export interface Project extends Omit<ProjectRecord, "image" | "link" | "pdf"> {
    image?: string;
    link?: string;
    pdf?: string;        // 실제 URL
}

export const pdfUrl = (fileName: string) => `${import.meta.env.BASE_URL}pdf/${fileName}`;

const imageUrls = import.meta.glob<string>(
    "../assets/portfolioimg/**/*.{png,jpg,jpeg,webp,gif}",
    { eager: true, import: "default" },
);

const resolveImage = (path: string) =>
    path ? imageUrls[`../assets/portfolioimg/${path}`] : undefined;

const toProject = (record: ProjectRecord): Project => ({
    ...record,
    image: resolveImage(record.image),
    link: record.link || undefined,
    pdf: record.pdf ? pdfUrl(record.pdf) : undefined,
});

const data = projectsJson as ProjectsFile;

export const mainPortfolioData: Project[] = data.main.map(toProject);
export const subPortfolioData: Project[] = data.sub.map(toProject);
export const allProjects: Project[] = [...mainPortfolioData, ...subPortfolioData];

export const findProject = (id: string | undefined) => allProjects.find(p => p.id === id) ?? null;

// 직접 쓴 글의 메타데이터와 소속 프로젝트 찾기
export const findPost = (slug: string) => {
    for (const project of allProjects) {
        const post = project.posts.find(p => p.slug === slug);
        if (post) return { post, project };
    }
    return null;
};
