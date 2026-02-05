import styled from "styled-components";
import BannerSection from "./section/BannerSection.tsx";
import ContentSection from "./section/ContentSection.tsx";

const PortfolioPage = () => {
    return (
        <>
            <BannerSection/>
            <ContentSection/>
        </>
    );
}

export default PortfolioPage;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;

