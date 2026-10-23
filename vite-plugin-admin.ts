import fs from "node:fs/promises";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { CATEGORIES, TRANSLATED_FIELDS } from "./src/data/projectSchema.ts";

// 개발 서버(npm run dev)에서만 동작하는 어드민 API.
// 빌드 결과물에는 포함되지 않음 (apply: "serve").
//   GET  /__admin/projects  → projects.json 읽기
//   PUT  /__admin/projects  → projects.json 저장
//   POST /__admin/upload?name=파일명 → 이미지 저장 후 { path } 반환
//   POST /__admin/upload-pdf?name=파일명 → public/pdf 에 발표자료 저장 후 { path } 반환
//   GET  /__admin/post?slug=  → 직접 쓴 글 본문(마크다운) 읽기
//   POST /__admin/upload-post-image?name=파일명 → public/posts/images 에 글 이미지 저장 후 { url } 반환

const DATA_FILE = path.resolve("src/data/projects.json");
const IMAGE_ROOT = path.resolve("src/assets/portfolioimg");
const UPLOAD_DIR = "uploads";
const PDF_ROOT = path.resolve("public/pdf");
const POSTS_DIR = path.resolve("src/content/posts");
const POST_IMAGE_DIR = path.resolve("public/posts/images");
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const CATEGORY_KEYS = new Set<string>(CATEGORIES.map(c => c.key));
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 50 * 1024 * 1024;
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const readBody = (req: IncomingMessage, limit: number) =>
    new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        let size = 0;
        req.on("data", (chunk: Buffer) => {
            size += chunk.length;
            if (size > limit) {
                reject(new Error(`파일이 너무 큽니다 (최대 ${limit / 1024 / 1024}MB)`));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
};

const isString = (v: unknown): v is string => typeof v === "string";

// 저장 전에 형태를 검사해서 잘못된 데이터로 사이트가 깨지지 않게 함
const validateProjects = (data: unknown): string | null => {
    if (!data || typeof data !== "object") return "잘못된 데이터 형식";
    const { main, sub } = data as Record<string, unknown>;
    if (!Array.isArray(main) || !Array.isArray(sub)) return "main/sub 배열이 필요합니다";
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const item of [...main, ...sub]) {
        const p = item as Record<string, unknown>;
        if (!isString(p.id) || !p.id || ids.has(p.id)) return "id가 비어 있거나 중복됩니다";
        ids.add(p.id);
        if (!isString(p.title) || !p.title.trim()) return "제목이 비어 있는 프로젝트가 있습니다";
        if (typeof p.year !== "number" || !Number.isInteger(p.year)) return `"${p.title}"의 연도가 올바르지 않습니다`;
        if (!isString(p.category) || !CATEGORY_KEYS.has(p.category)) return `"${p.title}"의 분류가 올바르지 않습니다`;
        for (const key of ["subtitle", "image", "link", "description", "skills", "joins"]) {
            if (!isString(p[key])) return `"${p.title}"의 ${key} 값이 올바르지 않습니다`;
        }
        if (p.image) {
            const resolved = path.resolve(IMAGE_ROOT, p.image as string);
            if (!resolved.startsWith(IMAGE_ROOT + path.sep)) return `"${p.title}"의 이미지 경로가 올바르지 않습니다`;
        }
        const en = p.en as Record<string, unknown> | undefined;
        if (!en || typeof en !== "object" || TRANSLATED_FIELDS.some(key => !isString(en[key]))) {
            return `"${p.title}"의 영어 번역 값이 올바르지 않습니다`;
        }
        if (!isString(p.pdf)) return `"${p.title}"의 pdf 값이 올바르지 않습니다`;
        if (p.pdf && (path.basename(p.pdf) !== p.pdf || !p.pdf.toLowerCase().endsWith(".pdf"))) {
            return `"${p.title}"의 발표자료 파일명이 올바르지 않습니다`;
        }
        if (!Array.isArray(p.posts)) return `"${p.title}"의 글 목록이 올바르지 않습니다`;
        for (const post of p.posts as Record<string, unknown>[]) {
            if (!isString(post?.title) || !post.title.trim()) return `"${p.title}"에 제목이 비어 있는 글이 있습니다`;
            if (!isString(post.slug) || !isString(post.url) || !isString(post.date)) return `"${p.title}"의 글 "${post.title}" 형식이 올바르지 않습니다`;
            if (post.slug) {
                if (!SLUG_PATTERN.test(post.slug)) return `"${post.title}" 글의 주소(slug)가 올바르지 않습니다`;
                if (slugs.has(post.slug)) return `"${post.title}" 글의 주소(slug)가 중복됩니다`;
                slugs.add(post.slug);
            } else if (!/^https?:\/\//.test(post.url)) {
                return `"${p.title}"의 글 "${post.title}" 링크가 http(s)로 시작하지 않습니다`;
            }
        }
    }
    return null;
};

export default function adminPlugin(): Plugin {
    return {
        name: "portfolio-admin",
        apply: "serve",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = new URL(req.url ?? "", "http://localhost");
                if (!url.pathname.startsWith("/__admin/")) return next();

                try {
                    if (url.pathname === "/__admin/projects" && req.method === "GET") {
                        const text = await fs.readFile(DATA_FILE, "utf-8");
                        return sendJson(res, 200, JSON.parse(text));
                    }

                    if (url.pathname === "/__admin/projects" && req.method === "PUT") {
                        const body = await readBody(req, 20 * 1024 * 1024);
                        // { projects, postBodies: { [slug]: 마크다운 } } — postBodies는 이번에 수정된 글만
                        const { projects, postBodies = {} } = JSON.parse(body.toString("utf-8"));
                        const error = validateProjects(projects);
                        if (error) return sendJson(res, 400, { error });

                        const usedSlugs = new Set<string>(
                            [...projects.main, ...projects.sub].flatMap((p: { posts: { slug: string }[] }) =>
                                p.posts.map(post => post.slug).filter(Boolean)),
                        );
                        await fs.mkdir(POSTS_DIR, { recursive: true });
                        for (const [slug, markdown] of Object.entries(postBodies)) {
                            if (!usedSlugs.has(slug) || typeof markdown !== "string") continue;
                            await fs.writeFile(path.join(POSTS_DIR, `${slug}.md`), markdown, "utf-8");
                        }
                        // 새 글인데 본문 없이 저장된 경우 빈 파일이라도 만들어 둠
                        for (const slug of usedSlugs) {
                            await fs.writeFile(path.join(POSTS_DIR, `${slug}.md`), "", { flag: "a" });
                        }
                        // 어디에서도 쓰지 않는 글 파일은 삭제
                        for (const file of await fs.readdir(POSTS_DIR)) {
                            if (file.endsWith(".md") && !usedSlugs.has(file.slice(0, -3))) {
                                await fs.unlink(path.join(POSTS_DIR, file));
                            }
                        }

                        await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2) + "\n", "utf-8");
                        return sendJson(res, 200, { ok: true });
                    }

                    if (url.pathname === "/__admin/post" && req.method === "GET") {
                        const slug = url.searchParams.get("slug") ?? "";
                        if (!SLUG_PATTERN.test(slug)) return sendJson(res, 400, { error: "잘못된 slug" });
                        const markdown = await fs.readFile(path.join(POSTS_DIR, `${slug}.md`), "utf-8").catch(() => "");
                        return sendJson(res, 200, { markdown });
                    }

                    if (url.pathname === "/__admin/upload-post-image" && req.method === "POST") {
                        const original = url.searchParams.get("name") ?? "";
                        const ext = path.extname(original).toLowerCase();
                        if (!IMAGE_EXTS.has(ext)) return sendJson(res, 400, { error: "png, jpg, webp, gif 이미지만 올릴 수 있습니다" });

                        const body = await readBody(req, MAX_UPLOAD_BYTES);
                        if (body.length === 0) return sendJson(res, 400, { error: "빈 파일입니다" });

                        const base = path.basename(original, ext).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "image";
                        const fileName = `${base}-${Date.now()}${ext}`;
                        await fs.mkdir(POST_IMAGE_DIR, { recursive: true });
                        await fs.writeFile(path.join(POST_IMAGE_DIR, fileName), body);
                        return sendJson(res, 200, { url: `/posts/images/${fileName}` });
                    }

                    if (url.pathname === "/__admin/upload" && req.method === "POST") {
                        const original = url.searchParams.get("name") ?? "";
                        const ext = path.extname(original).toLowerCase();
                        if (!IMAGE_EXTS.has(ext)) return sendJson(res, 400, { error: "png, jpg, webp, gif 이미지만 올릴 수 있습니다" });

                        const body = await readBody(req, MAX_UPLOAD_BYTES);
                        if (body.length === 0) return sendJson(res, 400, { error: "빈 파일입니다" });

                        // 파일명은 영문/숫자만 남기고 시간값을 붙여 충돌 방지
                        const base = path.basename(original, ext).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "image";
                        const fileName = `${base}-${Date.now()}${ext}`;
                        await fs.mkdir(path.join(IMAGE_ROOT, UPLOAD_DIR), { recursive: true });
                        await fs.writeFile(path.join(IMAGE_ROOT, UPLOAD_DIR, fileName), body);
                        return sendJson(res, 200, { path: `${UPLOAD_DIR}/${fileName}` });
                    }

                    if (url.pathname === "/__admin/upload-pdf" && req.method === "POST") {
                        const original = url.searchParams.get("name") ?? "";
                        if (path.extname(original).toLowerCase() !== ".pdf") return sendJson(res, 400, { error: "PDF 파일만 올릴 수 있습니다" });

                        const body = await readBody(req, MAX_PDF_BYTES);
                        if (body.subarray(0, 5).toString("latin1") !== "%PDF-") return sendJson(res, 400, { error: "올바른 PDF 파일이 아닙니다" });

                        const base = path.basename(original, ".pdf").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "slides";
                        const fileName = `${base}-${Date.now()}.pdf`;
                        await fs.mkdir(PDF_ROOT, { recursive: true });
                        await fs.writeFile(path.join(PDF_ROOT, fileName), body);
                        return sendJson(res, 200, { path: fileName });
                    }

                    return sendJson(res, 404, { error: "Not found" });
                } catch (e) {
                    return sendJson(res, 500, { error: e instanceof Error ? e.message : "서버 오류" });
                }
            });
        },
    };
}
