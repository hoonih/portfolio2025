import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { CATEGORIES, mainPortfolioData, subPortfolioData, type Project } from "../data/projects.ts";
import ProjectCard from "../component/ProjectCard.tsx";
import { media } from "../../../styles/media.ts";

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
            <Sidebar ref={sidebarRef}>
                {groups.map(({ key, label }) => (
                    <GroupButton
                        key={key}
                        data-key={key}
                        type="button"
                        $active={key === activeKey}
                        onClick={() => scrollToGroup(key)}
                    >
                        {label}
                    </GroupButton>
                ))}
            </Sidebar>

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
        </Container>
    );
};

export default CategoryArchiveSection;

const Container = styled.section`
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 32px 16px 80px;

    ${media.mobile} {
        gap: 12px;
    }
    ${media.small} {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }
`;

const Sidebar = styled.nav`
    position: sticky;
    top: calc(var(--header-height, 72px) + 16px);
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
    padding: 12px 16px 12px 8px;
    border-radius: 12px;
    background: #141414;

    ${media.small} {
        top: var(--header-height, 72px);
        z-index: 5;
        flex-direction: row;
        gap: 16px;
        padding: 12px 8px;
        border-radius: 0;
        margin: 0 -16px;
        background: #0A0A0A;
        overflow-x: auto;
    }
`;

const GroupButton = styled.button<{ $active: boolean }>`
    padding: 2px 0 2px 8px;
    border: 0;
    border-left: 2px solid currentColor;
    background: none;
    color: ${props => props.$active ? "#FFF" : "#3A3A3A"};
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.$active ? "#FFF" : "#7A7A7A"};
    }

    ${media.mobile} {
        font-size: 15px;
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px 16px;

    ${media.tablet} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    ${media.mobile} {
        gap: 24px 8px;
    }
`;
