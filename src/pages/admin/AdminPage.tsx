import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CATEGORIES, type ProjectRecord, type ProjectsFile } from "../portfolio/data/projects.ts";
import { type ProjectGroup, createEmptyProject, fetchPostBody, fetchProjects, imagePreviewUrl, saveProjects } from "./adminApi.ts";
import ProjectEditor from "./ProjectEditor.tsx";
import { GhostButton, PrimaryButton } from "./adminStyles.ts";
import { media } from "../../styles/media.ts";

interface Editing {
    project: ProjectRecord;
    group: ProjectGroup;
    isNew: boolean;
}

const SECTIONS: { key: ProjectGroup; title: string; description: string }[] = [
    { key: "main", title: "MAIN PROJECT", description: "해당 분류 맨 앞에 MAIN 배지와 함께 고정돼요 (MAIN끼리는 최신 연도순, 같은 연도면 이 순서대로)" },
    { key: "sub", title: "SUB PROJECT", description: "해당 분류에서 MAIN 다음에 최신 연도순으로 표시돼요 (같은 연도면 이 순서대로)" },
];

// 개발 서버 전용 포트폴리오 관리 페이지 (/admin)
const AdminPage = () => {
    const [data, setData] = useState<ProjectsFile | null>(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
    const [editing, setEditing] = useState<Editing | null>(null);
    // 저장 전까지 수정된 블로그 글 본문 { slug: 마크다운 }
    const [postBodies, setPostBodies] = useState<Record<string, string>>({});

    const load = useCallback(async () => {
        try {
            setData(await fetchProjects());
            setPostBodies({});
            setDirty(false);
        } catch (e) {
            setMessage({ type: "error", text: e instanceof Error ? e.message : "불러오기 실패" });
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // 저장하지 않은 변경이 있으면 페이지를 떠날 때 경고
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    const update = (next: ProjectsFile) => {
        setData(next);
        setDirty(true);
        setMessage(null);
    };

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await saveProjects(data, postBodies);
            setPostBodies({});
            setDirty(false);
            setMessage({ type: "ok", text: "저장했어요. projects.json에 반영됐어요." });
        } catch (e) {
            setMessage({ type: "error", text: e instanceof Error ? e.message : "저장 실패" });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (!confirm("저장하지 않은 변경사항을 모두 버릴까요?")) return;
        setMessage(null);
        load();
    };

    const move = (group: ProjectGroup, index: number, delta: number) => {
        if (!data) return;
        const list = [...data[group]];
        const target = index + delta;
        if (target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        update({ ...data, [group]: list });
    };

    const remove = (group: ProjectGroup, project: ProjectRecord) => {
        if (!data) return;
        if (!confirm(`"${project.title}" 프로젝트를 삭제할까요?`)) return;
        update({ ...data, [group]: data[group].filter(p => p.id !== project.id) });
    };

    const loadPostBody = useCallback(
        async (slug: string) => postBodies[slug] ?? fetchPostBody(slug),
        [postBodies],
    );

    const applyEdit = (project: ProjectRecord, group: ProjectGroup, bodies: Record<string, string>) => {
        if (!data || !editing) return;
        const next: ProjectsFile = { main: [...data.main], sub: [...data.sub] };
        const from = next[editing.group];
        const index = from.findIndex(p => p.id === project.id);

        if (index >= 0 && editing.group === group) {
            from[index] = project; // 같은 구분 안에서 수정 → 자리 유지
        } else {
            if (index >= 0) from.splice(index, 1); // 구분이 바뀌면 원래 목록에서 빼고
            next[group].push(project);           // 새 목록 맨 뒤에 추가
        }

        update(next);
        setPostBodies(prev => ({ ...prev, ...bodies }));
        setEditing(null);
    };

    const closeEditor = useCallback(() => setEditing(null), []);

    return (
        <Page>
            <TopBar>
                <TopBarLeft>
                    <PageTitle>포트폴리오 어드민</PageTitle>
                    <SiteLink to="/portfolio">사이트에서 보기 →</SiteLink>
                </TopBarLeft>
                <TopBarRight>
                    {dirty && <DirtyBadge>저장 안 된 변경사항</DirtyBadge>}
                    <GhostButton type="button" onClick={handleReset} disabled={!dirty || saving}>되돌리기</GhostButton>
                    <PrimaryButton type="button" onClick={handleSave} disabled={!dirty || saving}>
                        {saving ? "저장 중..." : "저장"}
                    </PrimaryButton>
                </TopBarRight>
            </TopBar>

            {message && <Message $type={message.type}>{message.text}</Message>}

            {!data && !message && <Empty>불러오는 중...</Empty>}

            {data && SECTIONS.map(({ key, title, description }) => (
                <Section key={key}>
                    <SectionHeader>
                        <div>
                            <SectionTitle>{title} <Count>{data[key].length}</Count></SectionTitle>
                            <SectionDescription>{description}</SectionDescription>
                        </div>
                        <GhostButton
                            type="button"
                            onClick={() => setEditing({ project: createEmptyProject(), group: key, isNew: true })}
                        >
                            + 추가
                        </GhostButton>
                    </SectionHeader>

                    {data[key].length === 0 && <Empty>프로젝트가 없어요</Empty>}

                    <List>
                        {data[key].map((project, index) => (
                            <Item key={project.id}>
                                <Thumb>
                                    {project.image
                                        ? <img src={imagePreviewUrl(project.image)} alt="" />
                                        : <span>{project.title.slice(0, 8)}</span>}
                                </Thumb>
                                <ItemText>
                                    <ItemTitle>
                                        {project.title}
                                        <Year>{project.year}</Year>
                                        <Tag>{CATEGORIES.find(c => c.key === project.category)?.label ?? "분류 없음"}</Tag>
                                        {project.link && <Tag>링크</Tag>}
                                        {project.pdf && <Tag>PDF</Tag>}
                                        {project.posts.length > 0 && <Tag>글 {project.posts.length}</Tag>}
                                    </ItemTitle>
                                    <ItemSubtitle>{project.subtitle || "한 줄 소개 없음"}</ItemSubtitle>
                                </ItemText>
                                <ItemActions>
                                    <IconButton type="button" aria-label="위로" disabled={index === 0} onClick={() => move(key, index, -1)}>↑</IconButton>
                                    <IconButton type="button" aria-label="아래로" disabled={index === data[key].length - 1} onClick={() => move(key, index, 1)}>↓</IconButton>
                                    <GhostButton type="button" onClick={() => setEditing({ project, group: key, isNew: false })}>수정</GhostButton>
                                    <DeleteButton type="button" onClick={() => remove(key, project)}>삭제</DeleteButton>
                                </ItemActions>
                            </Item>
                        ))}
                    </List>
                </Section>
            ))}

            {editing && (
                <ProjectEditor
                    key={editing.project.id}
                    project={editing.project}
                    group={editing.group}
                    isNew={editing.isNew}
                    loadPostBody={loadPostBody}
                    onApply={applyEdit}
                    onCancel={closeEditor}
                />
            )}
        </Page>
    );
};

export default AdminPage;

const Page = styled.div`
    min-height: 100vh;
    padding: 0 16px 80px;
    background: #0A0A0A;
    color: #FFF;
`;

const TopBar = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #1E1E1E;
    background: #0A0A0A;

    ${media.mobile} {
        flex-direction: column;
        align-items: stretch;
    }
`;

const TopBarLeft = styled.div`
    display: flex;
    align-items: baseline;
    gap: 16px;
`;

const TopBarRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    ${media.mobile} {
        justify-content: flex-end;
    }
`;

const PageTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
`;

const SiteLink = styled(Link)`
    color: #9F9F9F;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
`;

const DirtyBadge = styled.span`
    margin-right: 4px;
    color: #FFB547;
    font-size: 13px;
    font-weight: 500;
`;

const Message = styled.p<{ $type: "ok" | "error" }>`
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: ${props => props.$type === "ok" ? "#13261A" : "#2A1414"};
    color: ${props => props.$type === "ok" ? "#6BDB8F" : "#FF6B6B"};
    font-size: 14px;
    font-weight: 500;
`;

const Section = styled.section`
    margin-top: 40px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
    margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
`;

const Count = styled.span`
    color: #5A5A5A;
    font-weight: 500;
`;

const SectionDescription = styled.p`
    margin-top: 4px;
    color: #7A7A7A;
    font-size: 13px;
    font-weight: 400;
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    border-top: 1px solid #1E1E1E;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #1E1E1E;

    ${media.mobile} {
        flex-wrap: wrap;
        gap: 12px;
    }
`;

const Thumb = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    aspect-ratio: 16 / 10;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background: #191919;
    color: #7A7A7A;
    font-size: 12px;
    font-weight: 600;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ItemText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
`;

const ItemTitle = styled.p`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
`;

const Year = styled.span`
    color: #7A7A7A;
    font-size: 13px;
    font-weight: 500;
`;

const Tag = styled.span`
    padding: 2px 6px;
    border-radius: 4px;
    background: #1E1E1E;
    color: #9F9F9F;
    font-size: 11px;
    font-weight: 500;
`;

const ItemSubtitle = styled.p`
    overflow: hidden;
    color: #9F9F9F;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const ItemActions = styled.div`
    display: flex;
    gap: 6px;
    flex-shrink: 0;

    ${media.mobile} {
        width: 100%;
        justify-content: flex-end;
    }
`;

const IconButton = styled(GhostButton)`
    width: 36px;
    padding: 9px 0;
`;

const DeleteButton = styled(GhostButton)`
    color: #FF6B6B;
`;

const Empty = styled.p`
    padding: 24px 0;
    color: #5A5A5A;
    font-size: 14px;
    font-weight: 400;
`;
