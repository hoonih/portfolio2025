import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import IntroducePage from "../pages/introduce/IntroducePage";
import PortfolioPage from "../pages/portfolio/PortfolioPage";
import BannerSection from "../pages/portfolio/section/BannerSection";
import ConnectPage from "../pages/connect/ConnectPage";
import { CONNECT_SECTION_ID, scrollToConnect } from "../utils/scroll";

// 어드민은 개발 서버(npm run dev)에서만 열림 — 빌드 결과물에는 포함되지 않음
// 블로그 글 페이지는 마크다운 렌더러가 커서 들어갈 때만 불러옴
const PostPage = lazy(() => import("../pages/post/PostPage"));
const AdminPage = import.meta.env.DEV ? lazy(() => import("../pages/admin/AdminPage")) : null;

type ScrollState = { scrollTo?: "connect" } | null;

const MainPage = () => {
    const location = useLocation();

    // 다른 페이지에서 CONNECT를 눌러 들어온 경우 연락처 섹션으로 스크롤
    useEffect(() => {
        if ((location.state as ScrollState)?.scrollTo !== "connect") return;
        const timer = window.setTimeout(scrollToConnect, 300);
        return () => clearTimeout(timer);
    }, [location.state]);

    return (
        <>
            <IntroducePage />

            <BannerSection />

            <div id={CONNECT_SECTION_ID}>
                <ConnectPage />
            </div>
        </>
    );
};

// 페이지 이동 시 스크롤을 맨 위로 (특정 섹션으로 이동하는 경우 제외)
const ScrollToTop = () => {
    const { pathname, state } = useLocation();

    useLayoutEffect(() => {
        if ((state as ScrollState)?.scrollTo) return;
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
};

const RenderPage = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/posts/:slug" element={<Suspense fallback={null}><PostPage /></Suspense>} />
                {AdminPage && (
                    <Route
                        path="/admin"
                        element={<Suspense fallback={null}><AdminPage /></Suspense>}
                    />
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default RenderPage;
