import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import name from "../assets/name.svg";
import { breakpoints, media } from "../styles/media.ts";
import { useLanguage } from "../i18n/languageContext.ts";

// name.svg의 원본 비율. 첫 진입 시 로고에 scaleY 애니메이션이 걸려 있어서
// 실제 height를 재면 틀어지므로 너비 × 비율로 계산함
const LOGO_RATIO = 87.34 / 1229;
const STACK_GAP = 12;        // 태블릿 이하에서 로고와 메뉴 사이 간격

const NAV_ITEMS = [
    { key: "introduce", label: "INTRODUCE", to: "/" },
    { key: "portfolio", label: "PORTFOLIO", to: "/portfolio" },
    { key: "connect", label: "CONNECT", to: "/connect" },
] as const;

const getActive = (pathname: string) => {
    if (pathname === "/") return "introduce";
    if (pathname.startsWith("/connect")) return "connect";
    return "portfolio"; // /portfolio, /posts/*
};

const Header = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const active = getActive(pathname);
    const { lang, setLang, t } = useLanguage();
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const logoHeightRef = useRef(0);

    // 스크롤에 따라 로고 축소 + 헤더 아래 흰 라인으로 읽은 만큼 표시
    // 매 스크롤마다 리렌더하지 않도록 DOM을 직접 갱신
    const handleScroll = () => {
        const scrollY = Math.max(window.scrollY, 0);

        const logoHeight = logoHeightRef.current;
        if (logoRef.current) {
            // 모바일은 로고가 이미 작으므로 줄이지 않음
            const minHeight = window.innerWidth <= breakpoints.mobile ? logoHeight : logoHeight / 2;
            logoRef.current.style.height = `${Math.min(logoHeight, Math.max(minHeight, logoHeight - scrollY))}px`;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

        headerRef.current?.toggleAttribute("data-scrolled", scrollY > 4);
    };

    // 로고 최대 크기 기준 헤더 높이를 --header-height로 노출 — 페이지 상단 여백, sticky 위치에 사용
    // 페인트 전에 계산해야 콘텐츠가 헤더 밑에 깔렸다가 내려오는 깜빡임이 없음
    useLayoutEffect(() => {
        const measure = () => {
            if (!logoRef.current) return;
            logoRef.current.style.height = ""; // 스크롤로 줄어든 height를 초기화한 뒤 너비를 측정
            const logoHeight = logoRef.current.getBoundingClientRect().width * LOGO_RATIO;
            logoHeightRef.current = logoHeight;

            // 태블릿 이하에서는 로고 아래로 메뉴가 내려가므로 메뉴 높이까지 포함
            // 데스크톱은 로고와 메뉴가 나란히 있으므로 둘 중 큰 쪽
            const isStacked = window.innerWidth <= breakpoints.tablet;
            const navHeight = navRef.current?.offsetHeight ?? 0;
            const contentHeight = isStacked ? logoHeight + STACK_GAP + navHeight : Math.max(logoHeight, navHeight);
            const style = headerRef.current ? getComputedStyle(headerRef.current) : null;
            const verticalPadding = style ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 0;
            document.documentElement.style.setProperty("--header-height", `${contentHeight + verticalPadding}px`);

            handleScroll();
        };

        measure();
        document.fonts?.ready.then(measure); // 웹폰트가 늦게 적용되면 메뉴 높이가 바뀜
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // 페이지가 바뀌면 문서 길이가 달라지므로 진행 라인도 다시 계산
    useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    return (
        <LogoWrapper ref={headerRef}>
            <AnimatedLogo src={name} alt="YeHoonHong" ref={logoRef}/>
            <NavContainer ref={navRef}>
                {NAV_ITEMS.map(({ key, label, to }) => (
                    <TopBarButton
                        key={key}
                        type="button"
                        $select={active === key}
                        aria-current={active === key ? "page" : undefined}
                        onClick={() => {
                            if (pathname === to) window.scrollTo({ top: 0, behavior: "smooth" });
                            else navigate(to);
                        }}
                    >
                        {label}
                    </TopBarButton>
                ))}
                <LangButton
                    type="button"
                    $select={false}
                    aria-label={t.languageToggle}
                    title={t.languageToggle}
                    onClick={() => setLang(lang === "en" ? "ko" : "en")}
                >
                    <GlobeIcon />
                    {lang.toUpperCase()}
                </LangButton>
            </NavContainer>
            <ScrollProgress ref={progressRef} aria-hidden />
        </LogoWrapper>
    );
};

export default Header;

const TopBarButton = styled.button<{ $select: boolean }>`
    display: flex;
    border: 0;
    padding: 12px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 16px;
    background: ${props => props.$select ? "#FFF" : "#191919"};
    color: ${props => props.$select ? "#191919" : "#FFF"};
    /* 화면 폭에 따라 커짐 — 480px: 약 17px, 1024px: 약 22px, 1920px 이상: 28px */
    font-size: clamp(15px, 0.9vw + 13px, 28px);
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    overflow: hidden;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
        background: ${props => props.$select ? "#FFF" : "#2A2A2A"};
    }

    ${media.tablet} {
        padding: 10px 8px;
        border-radius: 12px;
    }
    ${media.small} {
        padding: 8px 6px;
        border-radius: 10px;
    }
`;

// 메뉴 버튼과 같은 스타일, 글자 대신 지구본 + 현재 언어만 표시해서 폭은 내용만큼
const LangButton = styled(TopBarButton)`
    flex: 0 0 auto;
    gap: 6px;
    padding-inline: 16px;

    svg {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
    }

    ${media.tablet} {
        padding-inline: 12px;
    }
    ${media.small} {
        padding-inline: 10px;
    }
`;

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19" />
        <path d="M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5s1.3-6.8 3.9-9.5z" />
    </svg>
);

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

// 높이가 바뀌지 않도록 border 대신 inset 그림자로 구분선 표시
const LogoWrapper = styled.header`
    z-index: 10;
    box-shadow: inset 0 -1px 0 #1A1A1A;

    &[data-scrolled] {
        box-shadow: inset 0 -1px 0 #2E2E2E;
    }
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


const ScrollProgress = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #FFF;
    transform: scaleX(0);
    transform-origin: left center;
    pointer-events: none;
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
