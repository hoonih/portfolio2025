import { lazy, Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { localizeProject, type Project } from "../../../data/projects.ts";
import { useLanguage } from "../../../i18n/languageContext.ts";
import { media } from "../../../styles/media.ts";
import { formatDate, hostLabel } from "../../../utils/format.ts";
import type { ProjectView } from "../portfolioState.ts";

// pdf.js는 용량이 커서 상세를 열 때만 불러옴
const PdfViewer = lazy(() => import("./PdfViewer.tsx"));

interface Props {
    project: Project | null;
    initialView?: ProjectView;
    onClose: () => void;
}

const ProjectDetailModal = ({ project: original, initialView = "slides", onClose }: Props) => {
    const { lang } = useLanguage();
    const project = original && localizeProject(original, lang);

    // 모달이 열려 있는 동안 ESC로 닫기 + 배경 스크롤 막기
    useEffect(() => {
        if (!project) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [project, onClose]);

    return (
        <AnimatePresence>
            {project && (
                <Overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <Panel
                        role="dialog"
                        aria-modal="true"
                        aria-label={project.title}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 24, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 프로젝트가 바뀌면 스위치 상태도 처음(발표자료)으로 */}
                        <DetailContent key={project.id} project={project} initialView={initialView} onClose={onClose} />
                    </Panel>
                </Overlay>
            )}
        </AnimatePresence>
    );
};

export default ProjectDetailModal;

const DetailContent = ({ project, initialView, onClose }: { project: Project; initialView: ProjectView; onClose: () => void }) => {
    const { t } = useLanguage();
    const [view, setView] = useState<ProjectView>(initialView);
    const showPosts = view === "posts";

    return (
        <>
            <Head>
                <HeadText>
                    <Year>{project.year}</Year>
                    <Title>{project.title}</Title>
                    <Subtitle>{project.subtitle}</Subtitle>
                </HeadText>
                <CloseButton type="button" onClick={onClose} aria-label={t.portfolio.close}>✕</CloseButton>
            </Head>

            {(project.image || project.description) && (
                <Overview $hasImage={!!project.image}>
                    {project.image && <Thumb src={project.image} alt={project.title} />}
                    {project.description && (
                        <Description>
                            {project.description.split("<br/>").map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </Description>
                    )}
                </Overview>
            )}

            {(project.skills || project.joins) && (
                <Meta>
                    {project.skills && (
                        <MetaRow>
                            <MetaLabel>{t.portfolio.skills}</MetaLabel>
                            <Chips>
                                {project.skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                                    <Chip key={skill}>{skill}</Chip>
                                ))}
                            </Chips>
                        </MetaRow>
                    )}
                    {project.joins && (
                        <MetaRow>
                            <MetaLabel>{t.portfolio.team}</MetaLabel>
                            <MetaValue>{project.joins}</MetaValue>
                        </MetaRow>
                    )}
                </Meta>
            )}

            <SwitchRow>
                <Switch
                    type="button"
                    role="switch"
                    aria-checked={showPosts}
                    aria-label={t.portfolio.showPosts}
                    onClick={() => setView(showPosts ? "slides" : "posts")}
                >
                    <SwitchKnob
                        initial={false}
                        animate={{ x: showPosts ? "100%" : "0%" }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                    <SwitchLabel $active={!showPosts}>{t.portfolio.slides}</SwitchLabel>
                    <SwitchLabel $active={showPosts}>
                        {t.portfolio.posts}{project.posts.length > 0 && ` ${project.posts.length}`}
                    </SwitchLabel>
                </Switch>
                {!showPosts && project.pdf && (
                    <OpenLink href={project.pdf} target="_blank" rel="noopener noreferrer">{t.portfolio.openInNewTab}</OpenLink>
                )}
            </SwitchRow>

            <ViewArea>
                {!showPosts && (
                    project.pdf
                        ? (
                            <Suspense fallback={<Empty>{t.portfolio.loadingSlides}</Empty>}>
                                <PdfViewer url={project.pdf} />
                            </Suspense>
                        )
                        : <Empty>{t.portfolio.noSlides}</Empty>
                )}

                {showPosts && (
                    project.posts.length > 0
                        ? (
                            <PostList>
                                {project.posts.map((post) => {
                                    const content = (
                                        <>
                                            <PostText>
                                                <PostTitle>{post.title}</PostTitle>
                                                <PostMeta>
                                                    {post.slug ? t.portfolio.blog : hostLabel(post.url)}
                                                    {post.date && ` · ${formatDate(post.date)}`}
                                                </PostMeta>
                                            </PostText>
                                            <Arrow aria-hidden>{post.slug ? "→" : "↗"}</Arrow>
                                        </>
                                    );
                                    return (
                                        <li key={post.slug || post.url}>
                                            {post.slug
                                                ? <PostLink as={Link} to={`/posts/${post.slug}`}>{content}</PostLink>
                                                : <PostLink href={post.url} target="_blank" rel="noopener noreferrer">{content}</PostLink>}
                                        </li>
                                    );
                                })}
                            </PostList>
                        )
                        : <Empty>{t.portfolio.noPosts}</Empty>
                )}
            </ViewArea>
        </>
    );
};

const Overlay = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.75);

    ${media.mobile} {
        align-items: flex-end;
        padding: 0;
    }
`;

const Panel = styled(motion.div)`
    position: relative;
    width: 100%;
    max-width: 960px;
    height: 90vh;
    overflow-y: auto;
    border-radius: 16px;
    background: #141414;

    ${media.mobile} {
        height: 92vh;
        border-radius: 16px 16px 0 0;
    }
`;

const Head = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding: 24px 24px 0;

    ${media.mobile} {
        padding: 20px 16px 0;
    }
`;

const HeadText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: 0;
    border-radius: 50%;
    background: #1E1E1E;
    color: #FFF;
    font-size: 16px;
    cursor: pointer;
`;

const Year = styled.p`
    color: #9F9F9F;
    font-size: 14px;
    font-weight: 500;
`;

const Title = styled.h2`
    color: #FFF;
    font-size: 32px;
    font-weight: 600;

    ${media.mobile} {
        font-size: 24px;
    }
`;

const Subtitle = styled.p`
    color: #C9C9C9;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.4;
    word-break: keep-all;

    ${media.mobile} {
        font-size: 15px;
    }
`;

// 썸네일은 작게 왼쪽에, 소개글은 바로 읽히도록 펼친 채로
const Overview = styled.div<{ $hasImage: boolean }>`
    display: grid;
    grid-template-columns: ${props => props.$hasImage ? "240px 1fr" : "1fr"};
    align-items: start;
    gap: 20px;
    margin: 20px 24px 0;

    ${media.mobile} {
        grid-template-columns: 1fr;
        gap: 14px;
        margin: 16px 16px 0;
    }
`;

const Thumb = styled.img`
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: 8px;
    background: #191919;

    ${media.mobile} {
        max-width: 200px;
    }
`;

const Description = styled.p`
    color: #E6E6E6;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.7;
    word-break: keep-all;
`;

const Meta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 24px 0;
    padding-top: 16px;
    border-top: 1px solid #262626;

    ${media.mobile} {
        margin: 16px 16px 0;
    }
`;

const MetaRow = styled.div`
    display: grid;
    grid-template-columns: 64px 1fr;
    align-items: baseline;
    gap: 12px;
`;

const MetaLabel = styled.span`
    color: #7A7A7A;
    font-size: 13px;
    font-weight: 500;
`;

const MetaValue = styled.span`
    color: #C9C9C9;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    word-break: keep-all;
`;

const Chips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const Chip = styled.span`
    padding: 4px 10px;
    border: 1px solid #333;
    border-radius: 999px;
    color: #C9C9C9;
    font-size: 12px;
    font-weight: 500;
`;

const SwitchRow = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: #141414;

    ${media.mobile} {
        padding: 12px 16px;
    }
`;

const Switch = styled.button`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px;
    border: 0;
    border-radius: 999px;
    background: #0A0A0A;
    cursor: pointer;
`;

const SwitchKnob = styled(motion.span)`
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc(50% - 4px);
    border-radius: 999px;
    background: #FFF;
`;

const SwitchLabel = styled.span<{ $active: boolean }>`
    position: relative;
    z-index: 1;
    padding: 8px 18px;
    color: ${props => props.$active ? "#0A0A0A" : "#9F9F9F"};
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    transition: color 0.2s ease;

    ${media.small} {
        padding: 7px 12px;
        font-size: 13px;
    }
`;

const OpenLink = styled.a`
    color: #9F9F9F;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
`;

const ViewArea = styled.div`
    padding: 0 24px 32px;

    ${media.mobile} {
        padding: 0 16px 32px;
    }
`;

const Empty = styled.p`
    padding: 48px 0;
    color: #7A7A7A;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
`;

const PostList = styled.ul`
    display: flex;
    flex-direction: column;
    border-top: 1px solid #262626;
`;

const PostLink = styled.a`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 4px;
    border-bottom: 1px solid #262626;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.03);
    }
`;

const PostText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

const PostTitle = styled.p`
    color: #FFF;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    word-break: keep-all;

    ${media.mobile} {
        font-size: 15px;
    }
`;

const PostMeta = styled.p`
    color: #7A7A7A;
    font-size: 13px;
    font-weight: 400;
`;

const Arrow = styled.span`
    flex-shrink: 0;
    color: #7A7A7A;
    font-size: 18px;
`;
