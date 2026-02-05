import { useRef } from "react";
import IntroducePage from "../pages/introduce/IntroducePage";
import PortfolioPage from "../pages/portfolio/PortfolioPage";
import ConnectPage from "../pages/connect/ConnectPage";

const RenderPage = () => {
    const introduceRef = useRef<HTMLDivElement>(null);
    const portfolioRef = useRef<HTMLDivElement>(null);
    const connectRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={introduceRef}>
                <IntroducePage
                    introduceRef={introduceRef}
                    portfolioRef={portfolioRef}
                    connectRef={connectRef}
                />
            </div>

            <div ref={portfolioRef}>
                <PortfolioPage />
            </div>

            <div ref={connectRef}>
                <ConnectPage />
            </div>
        </>
    );
};

export default RenderPage;
