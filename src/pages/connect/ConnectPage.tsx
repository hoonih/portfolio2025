import styled from "styled-components";

const ConnectPage = () => {
    return (
        <Container>
            <TitleText>협업, 외주, 커피챗, 프로젝트 문의</TitleText>
            <ContentText>이메일 hg.yehoon@gmail.com</ContentText>
            <ContentText>인스타 @yehoonhong</ContentText>
            <ContentText>링크드인 @yehoonhong</ContentText>
        </Container>
    );
}

export default ConnectPage;


const Container = styled.div`
    width: 100vw;
    padding: 88px 0px;
    justify-content: center;
    display: flex;
    background: #FFF;
    align-items: center;
    flex-direction: column;
    gap: 15px;
`;

const TitleText = styled.p`
    color: #000;
    text-align: center;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    
`

const ContentText = styled.p`
    color: #000;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;
