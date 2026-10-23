import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import name from "../assets/name.svg";
import { breakpoints, media } from "../styles/media.ts";
import { CONNECT_SECTION_ID, scrollToConnect } from "../utils/scroll.ts";

interface Props {
    // 헤더 높이(로고 최대 크기 기준)가 바뀔 때 호출 — 고정 헤더 아래 콘텐츠 여백용
    onHeightChange?: (height: number) => void;
}

const Header = ({ onHeightChange }: Props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isMain = pathname === "/";
    const logoRef = useRef<HTMLImageElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const [mainActive, setMainActive] = useState<"introduce" | "connect">("introduce");
    const active = isMain ? mainActive : "portfolio";

    // 메인 페이지에서는 스크롤 위치로 INTRODUCE / CONNECT 활성화
    useEffect(() => {
        if (!isMain) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const connectTop = document.getElementById(CONNECT_SECTION_ID)?.offsetTop ?? 0;

            const isBottom =
                scrollY + windowHeight >= documentHeight - 10; // 👈 바닥 판정

            if (isBottom) {
                setMainActive("connect");
            } else if (scrollY >= connectTop - 200) {
                setMainActive("connect");
            } else {
                setMainActive("introduce");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMain]);

    useEffect(() => {
        let logoHeight = 0;

        const measure = () => {
            if (!logoRef.current) return;
            const isStacked = window.innerWidth <= breakpoints.tablet;

            logoRef.current.style.height = ""; // 스크롤로 줄어든 height를 초기화한 뒤 너비를 측정
            const logowidth = logoRef.current.getBoundingClientRect().width;
            logoHeight = 87.34 * logowidth / 1229;                  //로고헤이트를 구합니다. 이 웹사이트 처음에 애니메이션이 들어가기에, height를 바로 불러오면 애니메이션이 적용됐을때의 스케일을 불러오기에 로고 비율 계산을 통해 계산합니다

            // 태블릿 이하에서는 로고 아래로 메뉴가 내려가므로 메뉴 높이까지 포함
            const navHeight = navRef.current?.offsetHeight ?? 0;
            const headerHeight = isStacked ? logoHeight + 12 + navHeight : logoHeight;
            onHeightChange?.(headerHeight);
            // sticky 요소에서 쓸 수 있도록 CSS 변수로도 노출 (헤더 상하 패딩 포함)
            document.documentElement.style.setProperty("--header-height", `${headerHeight + 32}px`);

            handleScroll();
        };

        const handleScroll = () => {
            if (!logoRef.current) return;

            const scrollY = Math.max(window.scrollY, 0); // 👈 음수 방지
            const rawScale = logoHeight - scrollY;

            // 모바일은 로고가 이미 작으므로 줄이지 않음
            const minHeight = window.innerWidth <= breakpoints.mobile ? logoHeight : logoHeight / 2;
            const maxHeight = logoHeight;

            const clampedHeight = Math.min(
                maxHeight,
                Math.max(minHeight, rawScale)
            );

            logoRef.current.style.height = `${clampedHeight}px`;
        };


        measure();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", measure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LogoWrapper>
            <AnimatedLogo src={name} ref={logoRef}/>
            <NavContainer ref={navRef}>
                <TopBarButton
                    $select={active === "introduce"}
                    onClick={() => {
                        if (!isMain) {
                            navigate("/");
                            return;
                        }
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                        setMainActive("introduce");
                    }}
                >
                    INTRODUCE
                </TopBarButton>

                <TopBarButton
                    $select={active === "portfolio"}
                    onClick={() => navigate("/portfolio")}
                >
                    PORTFOLIO
                </TopBarButton>

                <TopBarButton
                    $select={active === "connect"}
                    onClick={() => {
                        if (isMain) scrollToConnect();
                        else navigate("/", { state: { scrollTo: "connect" } });
                    }}
                >
                    CONNECT
                </TopBarButton>
            </NavContainer>
        </LogoWrapper>
    );
};

export default Header;

const TopBarButton = styled.div<{$select?: boolean}>`
    display: flex;
    padding: 12px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 16px;
    background: ${props => props.$select ? "#FFF" : "#191919"};
    color: ${props => props.$select ? "#191919" : "#FFF"};
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    overflow: hidden;
    cursor: pointer;
    white-space: nowrap;

    ${media.tablet} {
        font-size: 18px;
        padding: 10px 8px;
        border-radius: 12px;
    }
    ${media.small} {
        font-size: 14px;
        padding: 8px 6px;
        border-radius: 10px;
    }
`;

const NavContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-left: 10px;
    gap: 16px;
    overflow: hidden;

    ${media.tablet} {
        gap: 8px;
    }
    ${media.tablet} {
        padding-left: 0;
    }
`;

const LogoWrapper = styled.div`
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: start;
    transform-origin: center bottom;
    transition: transform 0.1s linear;
    position: fixed;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;


    background-color: black;

    ${media.tablet} {
        flex-direction: column;
        gap: 12px;
    }
    ${media.mobile} {
        padding: 12px 16px;
    }
`;


const squashStretch = keyframes`
  0% {
    transform: scaleY(0.25);
    opacity: 1;
  }
  60% {
    transform: scaleY(1.1);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
  }
`;

const AnimatedLogo = styled.img`
  transform-origin: center center;
  animation: ${squashStretch} 1s cubic-bezier(0.22, 1, 0.36, 1);
`;
