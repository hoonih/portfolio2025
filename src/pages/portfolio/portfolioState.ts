// 다른 페이지에서 /portfolio로 이동하면서 특정 프로젝트 상세를 열 때 쓰는 location.state
// 예) 글 페이지의 "← 프로젝트" 링크: <Link to="/portfolio" state={portfolioState(id, "posts")}>

export type ProjectView = "slides" | "posts";

export interface PortfolioState {
    openProject?: string;
    view?: ProjectView;
}

export const portfolioState = (openProject: string, view: ProjectView): PortfolioState => ({ openProject, view });
