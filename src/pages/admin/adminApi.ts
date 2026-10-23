import { CATEGORIES, type ProjectRecord, type ProjectsFile } from "../../data/projectSchema.ts";
export { pdfUrl } from "../../data/projects.ts";

export type ProjectGroup = keyof ProjectsFile; // "main" | "sub"

// 개발 서버에서는 src 파일을 그대로 서빙하므로 업로드 직후에도 미리보기 가능
export const imagePreviewUrl = (path: string) => `/src/assets/portfolioimg/${path}`;

const request = async <T,>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? `요청 실패 (${res.status})`);
    return body as T;
};

export const fetchProjects = () => request<ProjectsFile>("/__admin/projects");

// postBodies: 이번에 수정한 글 본문만 { slug: 마크다운 }
export const saveProjects = (projects: ProjectsFile, postBodies: Record<string, string>) =>
    request<{ ok: true }>("/__admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, postBodies }),
    });

export const fetchPostBody = (slug: string) =>
    request<{ markdown: string }>(`/__admin/post?slug=${encodeURIComponent(slug)}`).then(r => r.markdown);

export const uploadPostImage = (file: File) =>
    request<{ url: string }>(`/__admin/upload-post-image?name=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
    });

export const createPostSlug = () => `post-${Date.now().toString(36)}`;

export const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const uploadImage = (file: File) =>
    request<{ path: string }>(`/__admin/upload?name=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
    });

export const uploadPdf = (file: File) =>
    request<{ path: string }>(`/__admin/upload-pdf?name=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
    });

export const createEmptyProject = (): ProjectRecord => ({
    id: `p-${Date.now().toString(36)}`,
    title: "",
    subtitle: "",
    year: new Date().getFullYear(),
    category: CATEGORIES[0].key,
    image: "",
    link: "",
    description: "",
    skills: "",
    joins: "",
    pdf: "",
    posts: [],
});
