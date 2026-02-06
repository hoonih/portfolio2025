import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import arrowdown from "../../../assets/keyboard_arrow_down.svg";

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

                <ScrollGuide variants={itemVariants}>
                    <ScrollText>아래의 포트폴리오를 구경해보세요</ScrollText>
                    <img src={arrowdown} alt="arrowdown" width={24} height={24} />
                </ScrollGuide>
            </Content>
        </Container>
    );
};

export default BannerSection;


const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15, // 텍스트 순차 등장
        },
    },
};

const itemVariants = {
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

const Container = styled.div`
    width: 100vw;
    background-color: white;
    height: 36vh;
    min-height: 316px;
    display: flex;
    justify-content: center;
    align-items: center;
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
`;

const ScrollText = styled(motion.p)`
    color: #afafaf;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
`;

const float = keyframes`
    0% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(8px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.8; }
`;

const ScrollGuide = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    animation: ${float} 2s ease-in-out infinite;
`;
