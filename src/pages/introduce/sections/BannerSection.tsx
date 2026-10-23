import styled from "styled-components";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import arrowForward from "../../../assets/arrow_forward.svg";
import {media} from "../../../styles/media.ts";

const BannerSection = () => {
    return (
        <Container>
            <Content
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <TitleText variants={itemVariants}>
                    사회 문제의 기술적 솔루션을 설계하고 <br />
                    웹앱 서비스로 구현하며 사람들의 일상 속에 자연스럽게 녹여냅니다.
                </TitleText>

                <motion.div variants={itemVariants}>
                    <PortfolioLink to="/portfolio">
                        포트폴리오 보러가기
                        <img src={arrowForward} alt="" width={20} height={20} />
                    </PortfolioLink>
                </motion.div>
            </Content>
        </Container>
    );
};

export default BannerSection;


const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15, // 텍스트 순차 등장
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 2,
            ease: "easeOut",
        },
    },
};

const Container = styled.section`
    width: 100%;
    padding: 48px 16px;
    background-color: white;
    height: 36vh;
    min-height: 316px;
    display: flex;
    justify-content: center;
    align-items: center;

    ${media.mobile} {
        height: auto;
        min-height: 240px;
    }
`;

const Content = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 36px;
    align-items: center;
`;

const TitleText = styled(motion.h1)`
    color: #000;
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    line-height: 1.4;
    word-break: keep-all;

    ${media.tablet} {
        font-size: 26px;
    }
    ${media.mobile} {
        font-size: 20px;

        br {
            display: none;
        }
    }
`;

const PortfolioLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 999px;
    background: #0A0A0A;
    color: #FFF;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;

    img {
        transition: transform 0.2s ease;
    }

    &:hover {
        background: #2A2A2A;

        img {
            transform: translateX(4px);
        }
    }

    ${media.mobile} {
        padding: 12px 22px;
        font-size: 16px;
    }
`;
