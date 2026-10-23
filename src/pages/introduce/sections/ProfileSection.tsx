import styled from "styled-components";
import GravitySkillShapes from "../components/GravitySkillShapes.tsx";
import { AWARDS, CAREERS, SKILLS } from "../../../data/profile.ts";
import { useDebouncedSize } from "../../../hooks/useDebouncedSize.ts";
import { media } from "../../../styles/media.ts";
import { useLanguage } from "../../../i18n/languageContext.ts";
import RichText from "../../../i18n/RichText.tsx";

const ProfileSection = () => {
    // 크기가 자리 잡은 뒤에만 물리 엔진을 띄움 (리사이즈 중에는 매번 다시 만들지 않도록)
    const [skillBoxRef, skillBoxSize] = useDebouncedSize<HTMLDivElement>();
    const { lang, t } = useLanguage();

    return (
        <Container>
            <InfoColumn>
                <IntroText>
                    <RichText text={t.intro} />
                </IntroText>

                <Groups>
                    <Group>
                        <GroupTitle>Career</GroupTitle>
                        {CAREERS.map(({ school, details }) => (
                            <CareerRow key={school.ko}>
                                <BoldText>{school[lang]}</BoldText>
                                <CareerDetail>
                                    {details.map(detail => <NormalText key={detail.ko}>{detail[lang]}</NormalText>)}
                                </CareerDetail>
                            </CareerRow>
                        ))}
                    </Group>

                    <Group>
                        <GroupTitle>Award</GroupTitle>
                        <AwardList>
                            {AWARDS.map(award => <li key={award.ko}><NormalText>{award[lang]}</NormalText></li>)}
                        </AwardList>
                    </Group>
                </Groups>
            </InfoColumn>

            <SkillColumn>
                <SkillBox ref={skillBoxRef}>
                    {skillBoxSize && (
                        <GravitySkillShapes skills={SKILLS} width={skillBoxSize.width} height={skillBoxSize.height} />
                    )}
                </SkillBox>
            </SkillColumn>
        </Container>
    );
};

export default ProfileSection;

const Container = styled.section`
    display: flex;
    gap: 13px;
    width: 100%;
    height: 100vh;
    min-height: 700px;
    padding: calc(var(--header-height) + 8px) 16px 16px;

    ${media.tablet} {
        flex-direction: column;
        gap: 40px;
        height: auto;
        min-height: 0;
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
    color: #FFF;
    font-size: 18px;
    font-weight: 400;

    strong {
        font-weight: 600;
    }

    ${media.tablet} {
        line-height: 1.5;
    }
    ${media.small} {
        font-size: 16px;
    }
`;

const Groups = styled.div`
    display: flex;
    flex-direction: column;
    gap: 64px;

    ${media.tablet} {
        gap: 48px;
    }
`;

// 제목 아래, 항목 사이마다 흰 구분선
const Group = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    > * + * {
        padding-top: 16px;
        border-top: 1px solid #FFF;
    }
`;

const GroupTitle = styled.h2`
    color: #FAFAFA;
    font-size: 40px;
    font-weight: 600;
    line-height: 22px;

    ${media.mobile} {
        font-size: 28px;
    }
`;

const CareerRow = styled.div`
    display: flex;
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

const AwardList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const NormalText = styled.span`
    color: #FFF;
    font-size: 18px;
    font-weight: 400;
    line-height: 22px;

    ${media.small} {
        font-size: 16px;
    }
`;

const BoldText = styled(NormalText)`
    font-weight: 600;
`;

const SkillColumn = styled.div`
    flex: 1;
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

const SkillBox = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid #FFF;
    overflow: hidden;
`;
