import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
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
            <Content>
                <Outlet />
            </Content>
        </>
    );
};

export default Layout;

// 헤더에 마우스를 올려 로고가 줄어든 만큼 콘텐츠를 끌어올림
// transform은 안쪽 position: fixed 요소(모달 등)의 기준을 바꾸므로 margin으로 이동
const Content = styled.div`
    margin-top: calc(-1 * var(--header-hover-shift, 0px));

    html[data-header-animating] & {
        transition: margin-top 350ms cubic-bezier(0.22, 1, 0.36, 1);
    }
`;
