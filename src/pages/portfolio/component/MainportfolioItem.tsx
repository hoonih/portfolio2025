import styled from "styled-components";
import ArrowUp from "../../../assets/keyboard_arrow_up_white.svg";
import ArrowDown from "../../../assets/keyboard_arrow_down_white.svg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MainportfolioItemProps {
    count: number;
    subtitle: string;
    title: string;
    image: string;
    description: string;
    skills: string;
    joins: string;
}

const MainportfolioItem = ({
                               count,
                               subtitle,
                               title,
                               image,
                               description,
                               skills,
                               joins,
                           }: MainportfolioItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Container>
            <TitleContainer onClick={() => setIsOpen(prev => !prev)}>
                <div style={{ display: "flex", gap: 24 }}>
                    <NumberText>0{count}.</NumberText>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <SubtitleText>{subtitle}</SubtitleText>
                        <TitleText>{title}</TitleText>
                    </div>
                </div>

                <motion.img
                    src={ArrowDown}
                    width={48}
                    alt="detail"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </TitleContainer>

            <AnimatePresence>
                {isOpen && (
                    <Content
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={contentVariants}
                    >
                        <Inner>
                            <img
                                src={image}
                                width={342}
                                height={342}
                                style={{ objectFit: "cover" }}
                                alt={title}
                            />

                            <TextBox>
                                <ContextText>
                                    {description.split("<br/>").map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </ContextText>

                                <div>
                                    <ContextSubText>
                                        사용 스킬: {skills}
                                    </ContextSubText>
                                    <ContextSubText>
                                        참여인원: {joins}
                                    </ContextSubText>
                                </div>
                            </TextBox>
                        </Inner>
                    </Content>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default MainportfolioItem;


const contentVariants = {
    collapsed: {
        opacity: 0,
        height: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    open: {
        opacity: 1,
        height: "auto",
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

const Content = styled(motion.div)`
    width: 100%;
    overflow: hidden;
`;

const Inner = styled.div`
    display: flex;
    gap: 13px;
    padding-bottom: 24px;
`;

const ContextSubText = styled.p`
    color: #FFF;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;
const ContextText=  styled.p`
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const TextBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1 0 0;
    align-self: stretch;
`

const TitleText = styled.p`
    color: #FFF;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`

const SubtitleText = styled.p`
    color: #C9C9C9;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;
const NumberText = styled.h1`
    color: #FFF;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid #FFF;
    align-items: flex-start;
`

const TitleContainer = styled.div`
    cursor: pointer;
    display: flex;
    width: 100%;
    padding: 24px 12px;
    justify-content: space-between;
    align-items: center;
`;
