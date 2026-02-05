import name from "../../assets/name.svg";
import styled from "styled-components";
import { keyframes } from "styled-components";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import GravitySkillBalls from "./component/GravitySkillBalls.tsx";
interface Props {
    introduceRef: React.RefObject<HTMLDivElement>;
    portfolioRef: React.RefObject<HTMLDivElement>;
    connectRef: React.RefObject<HTMLDivElement>;
}


const IntroducePage = ({ introduceRef, portfolioRef, connectRef }: Props) => {
    const logoRef = useRef<HTMLDivElement>(null);
    const skillballRef = useRef<HTMLDivElement>(null);
    const fixedRef = useRef(false);
    const [skillBallContainerWidth, setSkillBallContainerWidth] = useState<number>(0);
    const [readyForGravity, setReadyForGravity] = useState(false);
    const [skillBallContainerHeight, setSkillBallContainerHeight] = useState<number>(0);
    const [logoHeight, setLogoHeight] = useState<number>(0);
    const HEIGHT_THRESHOLD = 5; // px
    const [active, setActive] = useState<"introduce" | "portfolio" | "connect">("introduce");
    const TOPBAR_HEIGHT = 85; // px (Logo + 버튼 영역 포함해서 여유있게)
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const portfolioTop = portfolioRef.current?.offsetTop ?? 0;
            const connectTop = connectRef.current?.offsetTop ?? 0;

            const isBottom =
                scrollY + windowHeight >= documentHeight - 10; // 👈 바닥 판정

            if (isBottom) {
                setActive("connect");
            } else if (scrollY >= connectTop - 200) {
                setActive("connect");
            } else if (scrollY >= portfolioTop - 200) {
                setActive("portfolio");
            } else {
                setActive("introduce");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;

        const top =
            ref.current.getBoundingClientRect().top +
            window.scrollY -
            TOPBAR_HEIGHT;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        // 값이 바뀌면 아직 준비 안 됨
        setReadyForGravity(false);

        // 이전 타이머 제거
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 1초 동안 변화 없으면 실행
        debounceTimerRef.current = window.setTimeout(() => {
            setReadyForGravity(true);
        }, 500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [skillBallContainerHeight]);


    useLayoutEffect(() => {
        if (!skillballRef.current) return;

        let prevHeight = 0;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;

            if (Math.abs(height - prevHeight) < HEIGHT_THRESHOLD) {
                return; // 👈 미세 변화 무시
            }

            prevHeight = height;

            setSkillBallContainerWidth(width);
            setSkillBallContainerHeight(height);
        });

        observer.observe(skillballRef.current);
        return () => observer.disconnect();
    }, []);


    useEffect(() => {

        if (!skillballRef.current) return;

        const { width, height } =
            skillballRef.current.getBoundingClientRect();

        setSkillBallContainerWidth(width);
        setSkillBallContainerHeight(height);

    }, [logoHeight]);


    useEffect(() => {
        console.log(skillBallContainerHeight);
    }, [skillBallContainerHeight]);

    useEffect(() => {
        const logowidth = logoRef.current?.getBoundingClientRect().width;
        const logoHeight = 87.34 * logowidth / 1229;                  //로고헤이트를 구합니다. 이 웹사이트 처음에 애니메이션이 들어가기에, height를 바로 불러오면 애니메이션이 적용됐을때의 스케일을 불러오기에 로고 비율 계산을 통해 계산합니다
        setLogoHeight(logoHeight);
        const targetHeight = logoHeight / 2;

        const handleScroll = () => {
            if (!logoRef.current) return;

            const scrollY = Math.max(window.scrollY, 0); // 👈 음수 방지
            const rawScale = logoHeight - scrollY;

            const minHeight = logoHeight / 2;
            const maxHeight = logoHeight;

            const clampedHeight = Math.min(
                maxHeight,
                Math.max(minHeight, rawScale)
            );

            logoRef.current.style.height = `${clampedHeight}px`;
        };


        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <LogoWrapper>
                <AnimatedLogo src={name} ref={logoRef}/>
                <div style={{display: "flex", flexDirection: "row", width: '100%', paddingLeft: 10, gap: 16, overflow: "hidden"}}>
                    <TopBarButton
                        select={active === "introduce"}
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            setActive("introduce");
                        }}
                    >
                        INTRODUCE
                    </TopBarButton>

                    <TopBarButton
                        select={active === "portfolio"}
                        onClick={() => scrollTo(portfolioRef)}
                    >
                        PORTFOLIO
                    </TopBarButton>

                    <TopBarButton
                        select={active === "connect"}
                        onClick={() => scrollTo(connectRef)}
                    >
                        CONNECT
                    </TopBarButton>



                </div>
            </LogoWrapper>

            <Container $paddingtop={logoHeight}>
                <div style={{width: '100%', flex: 1, display: 'flex', flexDirection:'row', gap: 13}}>
                    <div style={{flex: 1, display: 'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        <p style={{ fontSize: 18, paddingTop: 8, fontWeight: 400, color: 'white' }}>
                            I aim to deliver value through{" "}
                            <span style={{ fontWeight: 600 }}>IT services</span> that have a viable{" "}
                            <span style={{ fontWeight: 600 }}>Business Model</span>, achieved by fusing
                            various IT technologies based on my broad interdisciplinary study.
                        </p>
                        <CareerAwardContainer>
                            <ItemContainer>
                                <TitleText>Career</TitleText>
                                <div style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
                                <div style={{width: '100%', justifyContent:'space-between', display: 'flex', flexDirection:'row'}}>
                                    <BoldText>선린인터넷고등학교 소프트웨어과</BoldText>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                        <NormalText>웹앱 개발 전공동아리 TAPIE 부장</NormalText>
                                        <NormalText>119대 전교부회장</NormalText>
                                    </div>
                                </div>
                                <div style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
                                <div style={{width: '100%', justifyContent:'space-between', display: 'flex', flexDirection:'row'}}>
                                    <BoldText>성균관대학교 공학계열</BoldText>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                        <NormalText>멋쟁이사자처럼 대학 성균관 자연과학 캠퍼스 대표</NormalText>
                                    </div>
                                </div>
                            </ItemContainer>
                            <ItemContainer>
                                <TitleText>Award</TitleText>
                                <div style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
                                <div style={{display: 'flex', flexDirection:'column', gap: 8}}>
                                    <NormalText>Smarteen app challenge 2024 우수상</NormalText>
                                    <NormalText>AppJam 24회 미래부문 최우수상</NormalText>
                                    <NormalText>AppJam 27회 생활부문 최우수상</NormalText>
                                    <NormalText>2024 직업계고 창의 아이디어 경진대회 금상</NormalText>
                                    <NormalText>2025 직업계고 창의 아이디어 경진대회 동상</NormalText>
                                    <NormalText>선린 해커톤 11회 금상</NormalText>
                                </div>
                            </ItemContainer>
                        </CareerAwardContainer>
                    </div>
                    <div style={{flex: 1, paddingTop: 8, display: 'flex', flexDirection:'column'}}>
                        <div style={{width: '100%', height: '100%'}}>
                            <div
                                ref={skillballRef}
                                style={{
                                    boxSizing: "border-box",
                                    width: "100%",
                                    height: "100%",
                                    border: "1px solid white",
                                    overflow: "hidden",
                                }}
                            >
                                {readyForGravity && (
                                    <GravitySkillBalls
                                        width={skillBallContainerWidth}
                                        height={skillBallContainerHeight}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default IntroducePage;

const TopBarButton = styled.div<{select?: boolean}>`
    display: flex;
    padding: 12px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 16px;
    background: ${props => props.select ? "#FFF" : "#191919"};
    color: ${props => props.select ? "#191919" : "#FFF"};
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    overflow: hidden;
`;
const LogoWrapper = styled.div`
    z-index: 1;
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


const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

const SelectedButton = styled.div `
    color: #0A0A0A;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    
    display: flex;
    padding: 18px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 20px;
    background: #FFF;
`;
const Button = styled.div`
    color: #FFF;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    
    display: flex;
    padding: 18px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 20px;
    background: #191919;
`
const Container = styled.div<{ $paddingtop?: number}>`
    padding-top: ${props => props.$paddingtop + 32}px;
    width: 100vw;
    height: 100vh;
    min-height: 700px;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    
`

const CareerAwardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 64px;
`;

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;
const TitleText = styled.text`
    color: #FAFAFA;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 55% */
`;

const BoldText = styled.span`
    color: #FFF;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 122.222% */
`;
const NormalText = styled.span`
    color: #FFF;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 122.222% */
`;
