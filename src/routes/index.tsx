import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import IntroducePage from "../pages/introduce/IntroducePage.tsx";
import PortfolioPage from "../pages/portfolio/PortfolioPage.tsx";
import ConnectPage from "../pages/connect/ConnectPage.tsx";

// 어드민은 개발 서버(npm run dev)에서만 열림 — 빌드 결과물에는 포함되지 않음
// 블로그 글 페이지는 마크다운 렌더러가 커서 들어갈 때만 불러옴
const PostPage = lazy(() => import("../pages/post/PostPage.tsx"));
const AdminPage = import.meta.env.DEV ? lazy(() => import("../pages/admin/AdminPage.tsx")) : null;

const RenderPage = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<IntroducePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/posts/:slug" element={<Suspense fallback={null}><PostPage /></Suspense>} />
        </Route>
        {AdminPage && (
            <Route path="/admin" element={<Suspense fallback={null}><AdminPage /></Suspense>} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default RenderPage;
