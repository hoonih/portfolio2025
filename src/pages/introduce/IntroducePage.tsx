import styled from "styled-components";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import GravitySkillBalls from "./component/GravitySkillBalls.tsx";
import {media} from "../../styles/media.ts";
import Header from "../../components/Header.tsx";

const IntroducePage = () => {
    const skillballRef = useRef<HTMLDivElement>(null);
    const fixedRef = useRef(false);
    const [skillBallContainerWidth, setSkillBallContainerWidth] = useState<number>(0);
    const [readyForGravity, setReadyForGravity] = useState(false);
    const [skillBallContainerHeight, setSkillBallContainerHeight] = useState<number>(0);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const HEIGHT_THRESHOLD = 5; // px
    const debounceTimerRef = useRef<number | null>(null);

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

    }, [headerHeight]);


    useEffect(() => {
        console.log(skillBallContainerHeight);
    }, [skillBallContainerHeight]);

    return (
        <>
            <Header onHeightChange={setHeaderHeight} />

            <Container $paddingtop={headerHeight}>
                <Body>
                    <InfoColumn>
                        <IntroText>
                            I aim to deliver value through{" "}
                            <span style={{ fontWeight: 600 }}>IT services</span> that have a viable{" "}
                            <span style={{ fontWeight: 600 }}>Business Model</span>, achieved by fusing
                            various IT technologies based on my broad interdisciplinary study.
                        </IntroText>
                        <CareerAwardContainer>
                            <ItemContainer>
                                <TitleText>Career</TitleText>
                                <div style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
                                <CareerRow>
                                    <BoldText>선린인터넷고등학교 소프트웨어과</BoldText>
                                    <CareerDetail>
                                        <NormalText>웹앱 개발 전공동아리 TAPIE 부장</NormalText>
                                        <NormalText>119대 전교부회장</NormalText>
                                    </CareerDetail>
                                </CareerRow>
                                <div style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
                                <CareerRow>
                                    <BoldText>성균관대학교 공학계열</BoldText>
                                    <CareerDetail>
                                        <NormalText>멋쟁이사자처럼 대학 성균관 자연과학 캠퍼스 대표</NormalText>
                                    </CareerDetail>
                                </CareerRow>
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
                    </InfoColumn>
                    <SkillColumn>
                        <div style={{width: '100%', height: '100%'}}>
                            <SkillBallBox ref={skillballRef}>
                                {readyForGravity && (
                                    <GravitySkillBalls
                                        width={skillBallContainerWidth}
                                        height={skillBallContainerHeight}
                                    />
                                )}
                            </SkillBallBox>
                        </div>
                    </SkillColumn>
                </Body>
            </Container>
        </>
    );
}

export default IntroducePage;





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
    width: 100%;
    height: 100vh;
    min-height: 700px;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;

    ${media.tablet} {
        height: auto;
        min-height: 0;
    }
`

const Body = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 13px;

    ${media.tablet} {
        flex-direction: column;
        gap: 40px;
    }
`;

const InfoColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${media.tablet} {
        gap: 48px;
    }
`;

const IntroText = styled.p`
    font-size: 18px;
    padding-top: 8px;
    font-weight: 400;
    color: white;

    ${media.tablet} {
        line-height: 1.5;
    }
    ${media.small} {
        font-size: 16px;
    }
`;

const SkillColumn = styled.div`
    flex: 1;
    padding-top: 8px;
    display: flex;
    flex-direction: column;

    ${media.tablet} {
        flex: none;
        height: 480px;
    }
    ${media.mobile} {
        height: 380px;
    }
`;

const SkillBallBox = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid white;
    overflow: hidden;
`;

const CareerRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;

    ${media.mobile} {
        flex-direction: column;
        gap: 8px;
    }
`;

const CareerDetail = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;

    ${media.mobile} {
        align-items: flex-start;
        text-align: left;
    }
`;

const CareerAwardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 64px;

    ${media.tablet} {
        gap: 48px;
    }
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

    ${media.mobile} {
        font-size: 28px;
    }
`;

const BoldText = styled.span`
    color: #FFF;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 122.222% */

    ${media.small} {
        font-size: 16px;
    }
`;
const NormalText = styled.span`
    color: #FFF;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 122.222% */

    ${media.small} {
        font-size: 16px;
    }
`;
