import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";

// 헤더는 한 번만 렌더링하고 페이지만 교체
// 페이지 콘텐츠는 고정 헤더 높이만큼 var(--header-height)로 띄움
const Layout = () => {
    const { pathname } = useLocation();

    // 페이지 이동 시 스크롤을 맨 위로
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default Layout;
