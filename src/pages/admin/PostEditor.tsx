import { lazy, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { uploadPostImage } from "./adminApi.ts";
import { GhostButton, Input, PrimaryButton } from "./adminStyles.ts";
import { media } from "../../styles/media.ts";

const MarkdownView = lazy(() => import("../../components/MarkdownView.tsx"));

export interface PostDraft {
    title: string;
    date: string;
    markdown: string;
}

interface Props {
    initial: PostDraft;
    projectTitle: string;
    onApply: (draft: PostDraft) => void;
    onCancel: () => void;
}

const HELP = "# 제목  **굵게**  *기울임*  - 목록  1. 번호  > 인용  [링크](https://...)  `코드`  --- 구분선";

// 블로그 글 작성기 (마크다운 + 실시간 미리보기, 이미지 붙여넣기/끌어놓기 지원)
const PostEditor = ({ initial, projectTitle, onApply, onCancel }: Props) => {
    const [draft, setDraft] = useState<PostDraft>(initial);
    const [tab, setTab] = useState<"write" | "preview">("write"); // 모바일에서만 사용
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const changed = draft.title !== initial.title || draft.date !== initial.date || draft.markdown !== initial.markdown;

    const handleCancel = () => {
        if (changed && !confirm("작성 중인 내용을 버릴까요?")) return;
        onCancel();
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                handleCancel();
            }
        };
        window.addEventListener("keydown", handleKey, true);
        return () => window.removeEventListener("keydown", handleKey, true);
    });

    // 커서 위치에 텍스트 삽입
    const insertText = (text: string) => {
        const el = textareaRef.current;
        const start = el?.selectionStart ?? draft.markdown.length;
        const end = el?.selectionEnd ?? draft.markdown.length;
        const markdown = draft.markdown.slice(0, start) + text + draft.markdown.slice(end);
        setDraft(prev => ({ ...prev, markdown }));
        requestAnimationFrame(() => {
            el?.focus();
            el?.setSelectionRange(start + text.length, start + text.length);
        });
    };

    const uploadFiles = async (files: File[]) => {
        const images = files.filter(f => f.type.startsWith("image/"));
        if (images.length === 0) return;
        setUploading(true);
        setError("");
        try {
            let text = "";
            for (const file of images) {
                const { url } = await uploadPostImage(file);
                text += `\n![](${url})\n`;
            }
            insertText(text);
        } catch (e) {
            setError(e instanceof Error ? e.message : "이미지 업로드 실패");
        } finally {
            setUploading(false);
        }
    };

    const handleApply = () => {
        if (!draft.title.trim()) {
            setError("글 제목을 입력해 주세요");
            return;
        }
        onApply({ ...draft, title: draft.title.trim() });
    };

    return (
        <Screen>
            <TopBar>
                <Breadcrumb>{projectTitle} · 블로그 글</Breadcrumb>
                <TopActions>
                    <GhostButton type="button" onClick={handleCancel}>취소</GhostButton>
                    <PrimaryButton type="button" onClick={handleApply} disabled={uploading}>적용</PrimaryButton>
                </TopActions>
            </TopBar>

            <MetaRow>
                <TitleInput
                    value={draft.title}
                    onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="글 제목"
                    autoFocus={!initial.title}
                />
                <DateInput
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft(prev => ({ ...prev, date: e.target.value }))}
                    aria-label="작성일"
                />
            </MetaRow>

            <Toolbar>
                <Tabs>
                    <TabButton type="button" $active={tab === "write"} onClick={() => setTab("write")}>작성</TabButton>
                    <TabButton type="button" $active={tab === "preview"} onClick={() => setTab("preview")}>미리보기</TabButton>
                </Tabs>
                <FileButton>
                    {uploading ? "업로드 중..." : "이미지 추가"}
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        disabled={uploading}
                        onChange={(e) => {
                            uploadFiles([...(e.target.files ?? [])]);
                            e.target.value = "";
                        }}
                    />
                </FileButton>
                <Help>{HELP}</Help>
            </Toolbar>

            {error && <ErrorText>{error}</ErrorText>}

            <Panes>
                <Pane $hiddenOnMobile={tab !== "write"}>
                    <Textarea
                        ref={textareaRef}
                        value={draft.markdown}
                        onChange={(e) => setDraft(prev => ({ ...prev, markdown: e.target.value }))}
                        onPaste={(e) => {
                            const files = [...e.clipboardData.files];
                            if (files.some(f => f.type.startsWith("image/"))) {
                                e.preventDefault();
                                uploadFiles(files);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const files = [...e.dataTransfer.files];
                            if (files.length > 0) {
                                e.preventDefault();
                                uploadFiles(files);
                            }
                        }}
                        placeholder={"마크다운으로 작성해요.\n이미지는 붙여넣기(⌘V)나 끌어다 놓기로도 넣을 수 있어요."}
                    />
                </Pane>
                <Pane $hiddenOnMobile={tab !== "preview"}>
                    <Preview>
                        {draft.markdown.trim()
                            ? <Suspense fallback={null}><MarkdownView markdown={draft.markdown} /></Suspense>
                            : <Empty>미리보기가 여기에 표시돼요</Empty>}
                    </Preview>
                </Pane>
            </Panes>
        </Screen>
    );
};

export default PostEditor;

const Screen = styled.div`
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    background: #0A0A0A;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #1E1E1E;
`;

const Breadcrumb = styled.p`
    overflow: hidden;
    color: #9F9F9F;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const TopActions = styled.div`
    display: flex;
    gap: 8px;
    flex-shrink: 0;
`;

const MetaRow = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 16px 16px 8px;

    ${media.mobile} {
        flex-direction: column;
        align-items: stretch;
    }
`;

const TitleInput = styled.input`
    flex: 1;
    min-width: 0;
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: #FFF;
    font-size: 30px;
    font-weight: 700;
    outline: none;

    &::placeholder {
        color: #3A3A3A;
    }

    ${media.mobile} {
        font-size: 24px;
    }
`;

const DateInput = styled(Input)`
    width: 170px;
    color-scheme: dark;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid #1E1E1E;
`;

const Tabs = styled.div`
    display: none;
    gap: 4px;

    ${media.mobile} {
        display: flex;
    }
`;

const TabButton = styled.button<{ $active: boolean }>`
    padding: 7px 12px;
    border: 0;
    border-radius: 8px;
    background: ${props => props.$active ? "#FFF" : "#1A1A1A"};
    color: ${props => props.$active ? "#0A0A0A" : "#9F9F9F"};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
`;

const FileButton = styled.span`
    position: relative;
    padding: 7px 12px;
    border: 1px solid #2A2A2A;
    border-radius: 8px;
    color: #FFF;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }
`;

const Help = styled.p`
    overflow: hidden;
    color: #5A5A5A;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    text-overflow: ellipsis;

    ${media.mobile} {
        display: none;
    }
`;

const ErrorText = styled.p`
    padding: 8px 16px 0;
    color: #FF6B6B;
    font-size: 14px;
    font-weight: 500;
`;

const Panes = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex: 1;
    min-height: 0;

    ${media.mobile} {
        grid-template-columns: 1fr;
    }
`;

const Pane = styled.div<{ $hiddenOnMobile: boolean }>`
    min-height: 0;
    overflow-y: auto;

    & + & {
        border-left: 1px solid #1E1E1E;
    }

    ${media.mobile} {
        display: ${props => props.$hiddenOnMobile ? "none" : "block"};

        & + & {
            border-left: 0;
        }
    }
`;

const Textarea = styled.textarea`
    display: block;
    width: 100%;
    height: 100%;
    padding: 20px 16px 80px;
    border: 0;
    background: transparent;
    color: #E6E6E6;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.7;
    outline: none;
    resize: none;

    &::placeholder {
        color: #3A3A3A;
    }
`;

const Preview = styled.div`
    max-width: 760px;
    margin: 0 auto;
    padding: 20px 24px 80px;
`;

const Empty = styled.p`
    padding: 48px 0;
    color: #3A3A3A;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
`;
