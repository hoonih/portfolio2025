import { useEffect, useState } from "react";
import styled from "styled-components";
import { CATEGORIES, emptyTranslation, type CategoryKey, type ProjectPost, type ProjectRecord, type ProjectTranslation } from "../../data/projectSchema.ts";
import { type ProjectGroup, createPostSlug, imagePreviewUrl, pdfUrl, today, uploadImage, uploadPdf } from "./adminApi.ts";
import { media } from "../../styles/media.ts";
import { buttonStyle, GhostButton, Input, inputStyle, PrimaryButton } from "./adminStyles.ts";
import PostEditor, { type PostDraft } from "./PostEditor.tsx";

interface Props {
    project: ProjectRecord;
    group: ProjectGroup;
    isNew: boolean;
    loadPostBody: (slug: string) => Promise<string>;
    // bodies: 이 창에서 작성/수정한 블로그 글 본문 { slug: 마크다운 }
    onApply: (project: ProjectRecord, group: ProjectGroup, bodies: Record<string, string>) => void;
    onCancel: () => void;
}

// 작성 중인 글: index가 null이면 새 글
interface EditingPost {
    index: number | null;
    slug: string;
    draft: PostDraft;
}

// 설명은 데이터에 <br/>로 저장돼 있어서, 편집할 때는 줄바꿈으로 바꿔서 보여줌
const toEditorText = (html: string) => html.replace(/ ?<br\/>/g, "\n");
const toStoredText = (text: string) => text.replace(/\r?\n/g, "<br/>");

const ProjectEditor = ({ project, group, isNew, loadPostBody, onApply, onCancel }: Props) => {
    const [form, setForm] = useState(() => {
        const en = { ...emptyTranslation(), ...project.en };
        return {
            ...project,
            description: toEditorText(project.description),
            en: { ...en, description: toEditorText(en.description) },
        };
    });
    const [formGroup, setFormGroup] = useState<ProjectGroup>(group);
    const [uploading, setUploading] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [error, setError] = useState("");
    const [bodies, setBodies] = useState<Record<string, string>>({});
    const [editingPost, setEditingPost] = useState<EditingPost | null>(null);

    useEffect(() => {
        if (editingPost) return; // 글 작성기가 열려 있으면 그쪽에서 ESC 처리
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onCancel, editingPost]);

    const openPostEditor = async (index: number | null) => {
        if (index === null) {
            setEditingPost({ index: null, slug: createPostSlug(), draft: { title: "", date: today(), markdown: "" } });
            return;
        }
        const post = form.posts[index];
        try {
            const markdown = bodies[post.slug] ?? await loadPostBody(post.slug);
            setEditingPost({ index, slug: post.slug, draft: { title: post.title, date: post.date, markdown } });
        } catch (e) {
            setError(e instanceof Error ? e.message : "글을 불러오지 못했어요");
        }
    };

    const applyPost = ({ title, date, markdown }: PostDraft) => {
        if (!editingPost) return;
        const { index, slug } = editingPost;
        const meta: ProjectPost = { title, date, slug, url: "" };
        set("posts", index === null
            ? [...form.posts, meta]
            : form.posts.map((post, i) => i === index ? meta : post));
        setBodies(prev => ({ ...prev, [slug]: markdown }));
        setEditingPost(null);
    };

    const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const { path } = await uploadImage(file);
            set("image", path);
        } catch (e) {
            setError(e instanceof Error ? e.message : "업로드 실패");
        } finally {
            setUploading(false);
        }
    };

    const handlePdf = async (file: File | undefined) => {
        if (!file) return;
        setUploadingPdf(true);
        setError("");
        try {
            const { path } = await uploadPdf(file);
            set("pdf", path);
        } catch (e) {
            setError(e instanceof Error ? e.message : "업로드 실패");
        } finally {
            setUploadingPdf(false);
        }
    };

    const setEn = (key: keyof ProjectTranslation, value: string) =>
        setForm(prev => ({ ...prev, en: { ...prev.en, [key]: value } }));

    const setPost = (index: number, patch: Partial<ProjectPost>) =>
        set("posts", form.posts.map((post, i) => i === index ? { ...post, ...patch } : post));

    const movePost = (index: number, delta: number) => {
        const target = index + delta;
        if (target < 0 || target >= form.posts.length) return;
        const posts = [...form.posts];
        [posts[index], posts[target]] = [posts[target], posts[index]];
        set("posts", posts);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 완전히 빈 외부 링크 행은 무시
        const posts = form.posts
            .map(post => ({ ...post, title: post.title.trim(), url: post.url.trim() }))
            .filter(post => post.slug || post.title || post.url);
        const badPost = posts.find(post => !post.title || (!post.slug && !/^https?:\/\//.test(post.url)));
        if (badPost) {
            setError(badPost.title
                ? `"${badPost.title}" 글의 링크를 https://로 시작하는 주소로 입력해 주세요`
                : "회고 · 블로그 글의 제목을 입력해 주세요");
            return;
        }
        if (!form.title.trim()) {
            setError("제목을 입력해 주세요");
            return;
        }
        if (!Number.isInteger(form.year) || form.year < 1990 || form.year > 2100) {
            setError("연도를 올바르게 입력해 주세요");
            return;
        }
        onApply(
            {
                ...form,
                title: form.title.trim(),
                link: form.link.trim(),
                description: toStoredText(form.description.trim()),
                en: {
                    title: form.en.title.trim(),
                    subtitle: form.en.subtitle.trim(),
                    description: toStoredText(form.en.description.trim()),
                    joins: form.en.joins.trim(),
                },
                posts,
            },
            formGroup,
            bodies,
        );
    };

    return (
        <>
        <Overlay onClick={onCancel}>
            <Panel onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <PanelTitle>{isNew ? "새 프로젝트" : "프로젝트 수정"}</PanelTitle>

                <Row>
                    <Field style={{ flex: 1 }}>
                        <Label>구분</Label>
                        <Select value={formGroup} onChange={(e) => setFormGroup(e.target.value as ProjectGroup)}>
                            <option value="main">MAIN (분류 맨 앞 고정)</option>
                            <option value="sub">SUB</option>
                        </Select>
                    </Field>
                    <Field style={{ width: 120 }}>
                        <Label>연도 *</Label>
                        <Input
                            type="number"
                            value={Number.isNaN(form.year) ? "" : form.year}
                            onChange={(e) => set("year", e.target.valueAsNumber)}
                        />
                    </Field>
                </Row>

                <Field>
                    <Label>분류 *</Label>
                    <Select value={form.category} onChange={(e) => set("category", e.target.value as CategoryKey)}>
                        {CATEGORIES.map(({ key, label }) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </Select>
                </Field>

                <Field>
                    <Label>제목 (한국어) *</Label>
                    <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="예: LAP" />
                </Field>

                <Field>
                    <Label>한 줄 소개 (한국어)</Label>
                    <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="예: 시각장애인을 위한 매장 내 길찾기" />
                </Field>

                <Field as="div">
                    <Label>이미지</Label>
                    <ImageRow>
                        <Preview>
                            {form.image
                                ? <img src={imagePreviewUrl(form.image)} alt="" />
                                : <span>없음</span>}
                        </Preview>
                        <ImageActions>
                            <FileButton>
                                {uploading ? "업로드 중..." : "이미지 선택"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    disabled={uploading}
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                            </FileButton>
                            {form.image && (
                                <GhostButton type="button" onClick={() => set("image", "")}>이미지 제거</GhostButton>
                            )}
                            <Hint>{form.image || "png, jpg, webp, gif · 최대 10MB"}</Hint>
                        </ImageActions>
                    </ImageRow>
                </Field>

                <Field>
                    <Label>외부 링크</Label>
                    <Input
                        type="url"
                        value={form.link}
                        onChange={(e) => set("link", e.target.value)}
                        placeholder="https://... (입력하면 카드 클릭 시 상세 대신 이 링크로 이동)"
                    />
                </Field>

                <Field>
                    <Label>설명 (한국어)</Label>
                    <Textarea
                        rows={8}
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="줄바꿈은 그대로 반영돼요"
                    />
                </Field>

                <Field>
                    <Label>사용 스킬</Label>
                    <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="예: ReactNative, Swift, FastAPI" />
                </Field>

                <Field>
                    <Label>참여인원 (한국어)</Label>
                    <Input value={form.joins} onChange={(e) => set("joins", e.target.value)} placeholder="예: 홍예훈(시스템 설계/개발), 이주영(디자인)" />
                </Field>

                <Section>
                    <SectionTitle>English</SectionTitle>
                    <Hint>영어가 기본 언어예요. 비워 둔 항목은 위의 한국어가 그대로 표시돼요.</Hint>
                    <Field>
                        <Label>Title</Label>
                        <Input value={form.en.title} onChange={(e) => setEn("title", e.target.value)} placeholder={form.title || "예: LAP"} />
                    </Field>
                    <Field>
                        <Label>Subtitle</Label>
                        <Input value={form.en.subtitle} onChange={(e) => setEn("subtitle", e.target.value)} placeholder="e.g. Indoor navigation for visually impaired shoppers" />
                    </Field>
                    <Field>
                        <Label>Description</Label>
                        <Textarea rows={8} value={form.en.description} onChange={(e) => setEn("description", e.target.value)} />
                    </Field>
                    <Field>
                        <Label>Team</Label>
                        <Input value={form.en.joins} onChange={(e) => setEn("joins", e.target.value)} placeholder="e.g. Yehoon Hong (system design/development)" />
                    </Field>
                </Section>

                <Field as="div">
                    <Label>발표자료 (PDF)</Label>
                    <InlineRow>
                        {form.pdf
                            ? <PdfName href={pdfUrl(form.pdf)} target="_blank" rel="noopener noreferrer">{form.pdf}</PdfName>
                            : <Hint>없음 · 최대 50MB</Hint>}
                        <FileButton>
                            {uploadingPdf ? "업로드 중..." : "PDF 선택"}
                            <input
                                type="file"
                                accept="application/pdf"
                                disabled={uploadingPdf}
                                onChange={(e) => handlePdf(e.target.files?.[0])}
                            />
                        </FileButton>
                        {form.pdf && <GhostButton type="button" onClick={() => set("pdf", "")}>제거</GhostButton>}
                    </InlineRow>
                </Field>

                <Field as="div">
                    <Label>회고 · 블로그 글 (위에서부터 순서대로 표시)</Label>
                    {form.posts.map((post, index) => (
                        <PostRow key={post.slug || index}>
                            <PostKind>{post.slug ? "직접 쓴 글" : "외부 링크"}</PostKind>
                            {post.slug ? (
                                <WrittenPost>
                                    <WrittenTitle>{post.title}</WrittenTitle>
                                    <Hint>{post.date || "날짜 없음"}{bodies[post.slug] !== undefined && " · 수정됨"}</Hint>
                                </WrittenPost>
                            ) : (<>
                            <Input
                                value={post.title}
                                onChange={(e) => setPost(index, { title: e.target.value })}
                                placeholder="글 제목"
                            />
                            <Input
                                type="url"
                                value={post.url}
                                onChange={(e) => setPost(index, { url: e.target.value })}
                                placeholder="https://velog.io/..."
                            />
                            </>)}
                            <PostRowBottom>
                                {post.slug
                                    ? <GhostButton type="button" style={{ flex: 1 }} onClick={() => openPostEditor(index)}>글 수정</GhostButton>
                                    : (
                                        <Input
                                            type="date"
                                            value={post.date}
                                            onChange={(e) => setPost(index, { date: e.target.value })}
                                            aria-label="작성일"
                                        />
                                    )}
                                <SmallButton type="button" aria-label="위로" disabled={index === 0} onClick={() => movePost(index, -1)}>↑</SmallButton>
                                <SmallButton type="button" aria-label="아래로" disabled={index === form.posts.length - 1} onClick={() => movePost(index, 1)}>↓</SmallButton>
                                <SmallButton
                                    type="button"
                                    aria-label="글 삭제"
                                    onClick={() => {
                                        if (post.slug && !confirm(`"${post.title}" 글을 삭제할까요? 저장하면 본문 파일도 지워져요.`)) return;
                                        set("posts", form.posts.filter((_, i) => i !== index));
                                    }}
                                >
                                    ✕
                                </SmallButton>
                            </PostRowBottom>
                        </PostRow>
                    ))}
                    <InlineRow>
                        <GhostButton type="button" onClick={() => openPostEditor(null)}>+ 블로그 글 쓰기</GhostButton>
                        <GhostButton
                            type="button"
                            onClick={() => set("posts", [...form.posts, { title: "", url: "", slug: "", date: "" }])}
                        >
                            + 외부 링크 추가
                        </GhostButton>
                    </InlineRow>
                </Field>

                {error && <ErrorText>{error}</ErrorText>}

                <Footer>
                    <GhostButton type="button" onClick={onCancel}>취소</GhostButton>
                    <PrimaryButton type="submit" disabled={uploading || uploadingPdf}>{isNew ? "추가" : "적용"}</PrimaryButton>
                </Footer>
            </Panel>
        </Overlay>
        {/* Overlay 바깥에 렌더링해서 클릭이 프로젝트 편집창을 닫지 않도록 */}
        {editingPost && (
            <PostEditor
                key={editingPost.slug}
                initial={editingPost.draft}
                projectTitle={form.title || "새 프로젝트"}
                onApply={applyPost}
                onCancel={() => setEditingPost(null)}
            />
        )}
        </>
    );
};

export default ProjectEditor;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 16px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.7);

    ${media.mobile} {
        padding: 0;
    }
`;

const Panel = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 640px;
    padding: 24px;
    border-radius: 16px;
    background: #141414;

    ${media.mobile} {
        min-height: 100%;
        border-radius: 0;
        padding: 20px 16px;
    }
`;

const PanelTitle = styled.h2`
    color: #FFF;
    font-size: 22px;
    font-weight: 600;
`;

const Row = styled.div`
    display: flex;
    gap: 12px;
`;

const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.span`
    color: #9F9F9F;
    font-size: 13px;
    font-weight: 500;
`;


const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background: #1A1A1A;
`;

const SectionTitle = styled.h3`
    color: #FFF;
    font-size: 15px;
    font-weight: 600;
`;

const Select = styled.select`${inputStyle}`;
const Textarea = styled.textarea`
    ${inputStyle}
    resize: vertical;
`;

const ImageRow = styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-start;
`;

const Preview = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    aspect-ratio: 16 / 10;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #0A0A0A;
    color: #5A5A5A;
    font-size: 13px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    ${media.small} {
        width: 112px;
    }
`;

const ImageActions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
`;

const Hint = styled.span`
    color: #5A5A5A;
    font-size: 12px;
    font-weight: 400;
    word-break: break-all;
`;




const FileButton = styled.span`
    ${buttonStyle}
    position: relative;
    border: 1px solid #2A2A2A;
    color: #FFF;

    input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }
`;

const InlineRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
`;

const PdfName = styled.a`
    max-width: 100%;
    overflow: hidden;
    color: #C9C9C9;
    font-size: 13px;
    font-weight: 400;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
`;

const PostRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border-radius: 8px;
    background: #1A1A1A;
`;

const PostRowBottom = styled.div`
    display: flex;
    gap: 6px;

    input {
        flex: 1;
        color-scheme: dark;
    }
`;

const PostKind = styled.span`
    color: #7A7A7A;
    font-size: 12px;
    font-weight: 500;
`;

const WrittenPost = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 0;
`;

const WrittenTitle = styled.p`
    color: #FFF;
    font-size: 15px;
    font-weight: 600;
`;

const SmallButton = styled(GhostButton)`
    width: 40px;
    padding: 9px 0;
`;

const ErrorText = styled.p`
    color: #FF6B6B;
    font-size: 14px;
    font-weight: 500;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
`;
