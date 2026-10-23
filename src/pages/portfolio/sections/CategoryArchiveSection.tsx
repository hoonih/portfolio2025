import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CATEGORIES } from "../../../data/projectSchema.ts";
import { mainPortfolioData, subPortfolioData, type Project } from "../../../data/projects.ts";
import ProjectCard from "../components/ProjectCard.tsx";
import { media } from "../../../styles/media.ts";
import { useLanguage } from "../../../i18n/languageContext.ts";

interface CategoryGroup {
    key: string;
    label: string;
    items: { project: Project; pinned: boolean }[];
}

interface Props {
    onSelect: (project: Project) => void;
}

const getHeaderHeight = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;

const CategoryArchiveSection = ({ onSelect }: Props) => {
    const { t } = useLanguage();
    const groups = useMemo<CategoryGroup[]>(() => {
        const all = [
            ...mainPortfolioData.map(project => ({ project, pinned: true })),
            ...subPortfolioData.map(project => ({ project, pinned: false })),
        ];
        return CATEGORIES
            .map(({ key, label }) => ({
                key,
                label,
                // MAIN 먼저(맨 앞 고정), 그다음 최신 연도순 — 같으면 어드민 순서 유지
                items: all
                    .filter(item => item.project.category === key)
                    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.project.year - a.project.year),
            }))
            .filter(group => group.items.length > 0); // 프로젝트가 없는 분류는 숨김
    }, []);

    const [activeKey, setActiveKey] = useState(groups[0]?.key);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const sidebarRef = useRef<HTMLElement>(null);

    // 모바일 가로 탭에서 현재 분류가 화면 밖에 있으면 보이도록 가로 스크롤
    useEffect(() => {
        const bar = sidebarRef.current;
        const button = bar?.querySelector<HTMLElement>(`[data-key="${activeKey}"]`);
        if (!bar || !button || bar.scrollWidth <= bar.clientWidth) return;
        bar.scrollTo({ left: button.offsetLeft - 16, behavior: "smooth" });
    }, [activeKey]);

    // 스크롤 위치에 따라 사이드바의 현재 분류 표시
    useEffect(() => {
        const handleScroll = () => {
            const offset = getHeaderHeight() + 120;
            let current = groups[0]?.key;
            groups.forEach(({ key }) => {
                const el = sectionRefs.current[key];
                if (el && el.getBoundingClientRect().top <= offset) current = key;
            });
            // 마지막 분류는 위까지 스크롤되지 않을 수 있어서, 바닥에 닿으면 마지막 분류로 표시
            const isBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
            if (isBottom && groups.length > 0) current = groups[groups.length - 1].key;
            setActiveKey(current);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [groups]);

    const scrollToGroup = (key: string) => {
        const el = sectionRefs.current[key];
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - 16;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <Container>
            <Content>
                {groups.map(({ key, label, items }) => (
                    <GroupSection key={key} ref={(el) => { sectionRefs.current[key] = el; }}>
                        <GroupTitle>{label}</GroupTitle>
                        <Grid>
                            {items.map(({ project, pinned }) => (
                                <ProjectCard key={project.id} project={project} pinned={pinned} onSelect={onSelect} />
                            ))}
                        </Grid>
                    </GroupSection>
                ))}
            </Content>

            {/* 오른쪽에 고정된 목차. 현재 분류 표시가 스크롤을 따라 미끄러지듯 이동 */}
            <Sidebar ref={sidebarRef} aria-label={t.portfolio.categories}>
                {groups.map(({ key, label, items }) => {
                    const active = key === activeKey;
                    return (
                        <GroupButton
                            key={key}
                            data-key={key}
                            type="button"
                            $active={active}
                            aria-current={active ? "true" : undefined}
                            onClick={() => scrollToGroup(key)}
                        >
                            {label}
                            <Count>{String(items.length).padStart(2, "0")}</Count>
                            {active && (
                                <Indicator
                                    layoutId="category-indicator"
                                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                />
                            )}
                        </GroupButton>
                    );
                })}
            </Sidebar>
        </Container>
    );
};

export default CategoryArchiveSection;

const Container = styled.section`
    display: flex;
    align-items: flex-start;
    gap: 32px;
    padding: 32px 16px 80px;

    ${media.mobile} {
        gap: 16px;
    }
    ${media.small} {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }
`;

// 데스크톱: 오른쪽 세로 레일 (오른쪽 선 위를 흰 막대가 따라다님)
// 작은 화면: 헤더 아래 가로 탭 (밑줄이 따라다님)
const Sidebar = styled.nav`
    position: sticky;
    top: calc(var(--header-height, 72px) + 24px);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    border-right: 1px solid #262626;

    ${media.small} {
        order: -1;
        top: var(--header-height, 72px);
        z-index: 5;
        flex-direction: row;
        align-items: stretch;
        gap: 20px;
        margin: 0 -16px;
        padding: 0 16px;
        border-right: 0;
        border-bottom: 1px solid #262626;
        background: #0A0A0A;
        overflow-x: auto;
    }
`;

const GroupButton = styled.button<{ $active: boolean }>`
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 8px 16px 8px 0;
    border: 0;
    background: none;
    color: ${props => props.$active ? "#FFF" : "#5A5A5A"};
    font-size: 15px;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.$active ? "#FFF" : "#9F9F9F"};
    }

    ${media.small} {
        padding: 12px 0;
        font-size: 14px;
    }
`;

const Count = styled.span`
    color: inherit;
    opacity: 0.5;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
`;

const Indicator = styled(motion.span)`
    position: absolute;
    top: 0;
    right: -1.5px;
    bottom: 0;
    width: 2px;
    border-radius: 2px;
    background: #FFF;

    ${media.small} {
        top: auto;
        right: 0;
        left: 0;
        bottom: -1px;
        width: auto;
        height: 2px;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 56px;
    flex: 1;
    min-width: 0;

    ${media.mobile} {
        gap: 40px;
    }
`;

const GroupSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const GroupTitle = styled.h2`
    color: #FFF;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.1;

    ${media.mobile} {
        font-size: 28px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px 16px;

    @media (max-width: 1280px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    ${media.tablet} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    ${media.mobile} {
        gap: 24px 8px;
    }
`;
