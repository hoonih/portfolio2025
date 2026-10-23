import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header.tsx";
import CategoryArchiveSection from "./section/CategoryArchiveSection.tsx";
import ProjectDetailModal from "./component/ProjectDetailModal.tsx";
import { mainPortfolioData, subPortfolioData, type Project } from "./data/projects.ts";

type PortfolioState = { openProject?: string; view?: "slides" | "posts" } | null;

const PortfolioPage = () => {
    const location = useLocation();
    const initial = location.state as PortfolioState;
    // 글 페이지에서 "← 프로젝트"로 돌아온 경우 그 프로젝트의 글 목록을 다시 열어줌
    const [selected, setSelected] = useState<Project | null>(() =>
        [...mainPortfolioData, ...subPortfolioData].find(p => p.id === initial?.openProject) ?? null);
    const [initialView] = useState(initial?.view ?? "slides");
    const [headerHeight, setHeaderHeight] = useState(0);
    const closeModal = useCallback(() => setSelected(null), []);

    return (
        <Container>
            <Header onHeightChange={setHeaderHeight} />
            <Main $paddingTop={headerHeight}>
                <CategoryArchiveSection onSelect={setSelected} />
            </Main>
            <ProjectDetailModal project={selected} initialView={initialView} onClose={closeModal} />
        </Container>
    );
}

export default PortfolioPage;

const Container = styled.div`
    min-height: 100vh;
    background: #0A0A0A;
`;

// 헤더가 fixed라서 헤더 높이 + 헤더 상하 패딩만큼 띄움
const Main = styled.main<{ $paddingTop: number }>`
    padding-top: ${props => props.$paddingTop + 32}px;
`;
