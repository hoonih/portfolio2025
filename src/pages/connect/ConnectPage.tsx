import { useState } from "react";
import styled from "styled-components";
import { motion, type Variants } from "framer-motion";
import { CONTACT_TOPICS, CONTACTS, EMAIL } from "../../data/profile.ts";
import { media } from "../../styles/media.ts";

const ConnectPage = () => {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <Container>
                <Hero
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <Title variants={itemVariants}>Let's connect.</Title>
                    <Topics variants={itemVariants}>
                        {CONTACT_TOPICS.map(topic => <Topic key={topic}>{topic}</Topic>)}
                    </Topics>
                    <Lead variants={itemVariants}>
                        새로운 아이디어나 함께 풀고 싶은 문제가 있다면 편하게 연락주세요.
                    </Lead>
                </Hero>

                <List
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {CONTACTS.map(({ label, value, href }) => (
                        <motion.li key={label} variants={itemVariants}>
                            <Row href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                                <Label>{label}</Label>
                                <Value>{value}</Value>
                                <Arrow aria-hidden>↗</Arrow>
                            </Row>
                        </motion.li>
                    ))}
                </List>

                <CopyButton type="button" onClick={copyEmail}>
                    {copied ? "복사되었어요 ✓" : "이메일 주소 복사"}
                </CopyButton>
        </Container>
    );
};

export default ConnectPage;

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Container = styled.main`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: calc(var(--header-height) + 48px) 16px 80px;
    background: #0A0A0A;

    ${media.mobile} {
        padding-top: calc(var(--header-height) + 24px);
    }
`;

const Hero = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 64px;

    ${media.mobile} {
        margin-bottom: 40px;
    }
`;

const Title = styled(motion.h1)`
    color: #FFF;
    font-size: 96px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.02em;

    ${media.tablet} {
        font-size: 72px;
    }
    ${media.mobile} {
        font-size: 48px;
    }
`;

const Topics = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Topic = styled.span`
    padding: 8px 14px;
    border: 1px solid #3A3A3A;
    border-radius: 999px;
    color: #C9C9C9;
    font-size: 15px;
    font-weight: 500;

    ${media.mobile} {
        padding: 6px 12px;
        font-size: 13px;
    }
`;

const Lead = styled(motion.p)`
    color: #9F9F9F;
    font-size: 18px;
    line-height: 1.5;
    word-break: keep-all;

    ${media.mobile} {
        font-size: 15px;
    }
`;

const List = styled(motion.ul)`
    border-top: 1px solid #FFF;
`;

const Row = styled.a`
    display: grid;
    grid-template-columns: 200px 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 28px 16px;
    border-bottom: 1px solid #FFF;
    color: #FFF;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;

    &:hover {
        background: #FFF;
        color: #0A0A0A;
    }

    &:hover span:last-child {
        transform: translate(4px, -4px);
    }

    ${media.mobile} {
        grid-template-columns: 1fr auto;
        row-gap: 6px;
        padding: 20px 8px;
    }
`;

const Label = styled.span`
    color: inherit;
    opacity: 0.6;
    font-size: 18px;
    font-weight: 500;

    ${media.mobile} {
        grid-column: 1 / -1;
        font-size: 14px;
    }
`;

const Value = styled.span`
    color: inherit;
    font-size: 32px;
    font-weight: 600;
    word-break: break-all;

    ${media.tablet} {
        font-size: 26px;
    }
    ${media.mobile} {
        font-size: 20px;
    }
`;

const Arrow = styled.span`
    color: inherit;
    font-size: 28px;
    transition: transform 0.25s ease;

    ${media.mobile} {
        font-size: 20px;
    }
`;

const CopyButton = styled.button`
    align-self: flex-start;
    margin-top: 24px;
    padding: 12px 22px;
    border: 0;
    border-radius: 999px;
    background: #191919;
    color: #FFF;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #2A2A2A;
    }
`;
