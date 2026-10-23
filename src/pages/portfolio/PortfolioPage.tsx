import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CategoryArchiveSection from "./sections/CategoryArchiveSection.tsx";
import ProjectDetailModal from "./components/ProjectDetailModal.tsx";
import { findProject, type Project } from "../../data/projects.ts";
import type { PortfolioState } from "./portfolioState.ts";

const PortfolioPage = () => {
    const location = useLocation();
    const initial = location.state as PortfolioState | null;
    // 글 페이지에서 "← 프로젝트"로 돌아온 경우 그 프로젝트의 글 목록을 다시 열어줌
    const [selected, setSelected] = useState<Project | null>(() => findProject(initial?.openProject));
    const [initialView] = useState(initial?.view ?? "slides");
    const closeModal = useCallback(() => setSelected(null), []);

    return (
        <Main>
            <CategoryArchiveSection onSelect={setSelected} />
            <ProjectDetailModal project={selected} initialView={initialView} onClose={closeModal} />
        </Main>
    );
};

export default PortfolioPage;

const Main = styled.main`
    min-height: 100vh;
    padding-top: var(--header-height);
    background: #0A0A0A;
`;
