import styled from "styled-components";
import MainportfolioItem from "../component/MainportfolioItem.tsx";
import {mainPortfolioData} from "../data/mainPortFolioData.ts";
import {useState} from "react";
import SubportfolioItem from "../component/SubPortFolioItem.tsx";
import {subPortfolioData} from "../data/subPortFolioData.ts";
import goIcon from "../../../assets/arrow_forward.svg"

const ContentSection = () => {

    const [selectedIndex, setSelectedIndex] = useState("main");

    return (
        <Container>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '22px',
                width: '100%'
            }}>
                {selectedIndex ===  "main" && (
                    <>
                        <div style={{display: 'flex', flexDirection: 'row', gap: '22px'}}>
                            <TitleActiveText onClick={() => (setSelectedIndex("main"))}>MAIN</TitleActiveText>
                            <TitleInActiveText onClick={() => (setSelectedIndex("sub"))}>SUB</TitleInActiveText>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 0, width: '100%'}}>
                            {mainPortfolioData.map((item) => (
                                <MainportfolioItem
                                    key={item.count}
                                    count={item.count}
                                    subtitle={item.subtitle}
                                    title={item.title}
                                    image={item.image}
                                    description={item.description}
                                    skills={item.skills}
                                    joins={item.joins}
                                />
                            ))}
                        </div>
                    </>
                )}

                {selectedIndex ===  "sub" && (
                    <>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '22px'}}>
                        <TitleInActiveText onClick={() => (setSelectedIndex("main"))}>MAIN</TitleInActiveText>
                        <TitleActiveText onClick={() => (setSelectedIndex("sub"))}>SUB</TitleActiveText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 0, width: '100%'}}>
                        {subPortfolioData.map((item) => (
                            <SubportfolioItem
                                key={item.count}
                                count={item.count}
                                subtitle={item.subtitle}
                                title={item.title}
                                image={item.image}
                                description={item.description}
                                skills={item.skills}
                                joins={item.joins}
                            />
                        ))}
                        <GoListItem
                            href="https://sunrin.graphics/2025"
                            target="_blank"
                            rel="noopener noreferrer">
                            <div style={{display: 'flex', flexDirection: 'row', gap: '24px'}}>
                                <GoListItemText>06.</GoListItemText>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <GoListItemSubTitle>선린인터넷고등학교 콘텐츠디자인과 졸업전시회 웹사이트(1인 개발)</GoListItemSubTitle>
                                    <GoListItemTitle>ARCADIA</GoListItemTitle>
                                </div>
                            </div>
                            <img src={goIcon} width={36} height={36}/>
                        </GoListItem>
                        <GoListItem
                            href="https://genesis.sunrin.graphics/"
                            target="_blank"
                            rel="noopener noreferrer">
                            <div style={{display: 'flex', flexDirection: 'row', gap: '24px'}}>
                                <GoListItemText>06.</GoListItemText>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <GoListItemSubTitle>선린인터넷고등학교 콘텐츠디자인과 시연회 웹사이트(1인 개발)</GoListItemSubTitle>
                                    <GoListItemTitle>GENESIS</GoListItemTitle>
                                </div>
                            </div>
                            <img src={goIcon} width={36} height={36}/>
                        </GoListItem>
                    </div>
                    </>
                )}
            </div>
        </Container>

    );
}

export default ContentSection;

const GoListItemTitle = styled.p`
    color: #FFF;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const GoListItemSubTitle = styled.p`
    color: #C9C9C9;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;
const GoListItemText = styled.p`
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const GoListItem = styled.a`
    display: flex;
    padding: 16px 12px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    border-top: 1px solid #FFF;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.04);
    }
`;

const TitleActiveText = styled.h1`
    color: #FFF;
    font-size: 48px;
    font-style: normal;
    font-weight: 500;
    cursor: pointer;
    line-height: normal;
`
const TitleInActiveText = styled.h1`
    color: #9F9F9F;
    font-size: 48px;
    font-style: normal;
    font-weight: 500;
    cursor: pointer;
    line-height: normal;
`
const Container = styled.div`
    display: flex;
    width: 100vw;
    padding: 50px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    background: #0A0A0A;
`
