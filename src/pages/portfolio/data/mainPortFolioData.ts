import SampleImg from "../../../assets/sampleImage.jpg";
import lap from "../../../assets/portfolioimg/main/lap.png"
import sangle from "../../../assets/portfolioimg/main/sangle.png"

export interface MainPortfolioData {
    count: number;
    subtitle: string;
    title: string;
    image: string;
    description: string;
    skills: string;
    joins: string;
}

export const mainPortfolioData: MainPortfolioData[] = [
    {
        count: 1,
        subtitle: "시각장애인을 위한 매장 내 길찾기",
        title: "LAP",
        image: lap,
        description:
            "기존의 실내 위치 파악 시스템은 블루투스 비콘이나 RFID를 기반으로 구축됩니다. 그러나 설치 비용과 유지 관리 문제로 실제 매장에 도입하기 어렵습니다. <br/><br/>이러한 문제점을 해결하기 위해 본 시스템은 컴퓨팅 비전 기술을 활용한 실내 길찾기 시스템을 설계하였습니다. 별도의 하드웨어 장치 없이 하나의 마커만으로 매장 구조도를 불러올 수 있으며, AI 에이전트가 시각장애인을 대상으로 매장 내 이동 경로를 안내합니다. 이를 통해 시각장애인이 매장에서 물품을 보다 독립적으로 탐색하고 구매할 수 있도록 지원합니다.",
        skills:
            "ReactNative, Swift, OpenCV, ChatGPT API, FastAPI, WebRTC, Oracle Cloud, Docker",
        joins:
            "홍예훈(시스템 설계/개발), 이주영(BM/디자인)",
    },
    {
        count: 2,
        subtitle: "저소득층 언어발달 장애 아동을 위한 디지털 재활키트",
        title: "SYNC",
        image: SampleImg,
        description:
            "언어 발달 장애 아동의 재활 치료는 장기간의 전문 세션이 필요하며, 높은 치료 비용으로 인해 지속적인 관리가 어려운 경우가 많습니다. 특히 저소득층 가정에서는 조기 개입이 중요함에도 불구하고 경제적 부담으로 충분한 치료를 받기 힘든 구조적인 한계가 존재합니다. <br/><br/>이러한 문제를 해결하기 위해 본 프로젝트는 아동이 일상 속에서 자연스럽게 언어 재활을 경험할 수 있는 인터랙티브 재활 시스템 SYNC를 설계하였습니다. 전용 애플리케이션과 블루투스 기반의 물리적 블럭을 연동하여 단어, 문장, 인지 재활 과정을 놀이 형태로 제공하며, 아동이 스스로 블럭을 조합하는 과정에서 언어 구조를 학습할 수 있도록 설계되었습니다. <br/><br/>SYNC는 저렴한 하드웨어 구성과 반복 사용 가능한 콘텐츠를 통해 재활 비용 부담을 낮추고, 재활 데이터를 기록/분석하여 보호자와 전문 기관에 인사이트를 제공합니다. 이를 통해 언어 발달 장애 아동이 보다 지속적이고 접근성 높은 환경에서 언어 능력을 향상시킬 수 있도록 지원합니다.",
        skills:
            "React Native, Bluetooth, ESP32, Arduino Uno, RF24, RFID(RC522), Embedded C/C++, TFT Display",
        joins:
            "홍예훈(시스템 설계/개발), 이주영(BM 구축/디자인)",
    },
    {
        count: 3,
        subtitle: "식재료 관리를 위한 NFC 포인트 정립기",
        title: "Sangle",
        image: sangle,
        description:
            "음식물 쓰레기는 과잉 생산과 소비로 인해 지속적으로 증가하고 있으며, 이는 자원 낭비를 넘어 환경 오염과 경제적 손실로 이어지고 있습니다. 특히 가정에서 발생하는 음식물 쓰레기는 소비자가 구매한 식재료를 체계적으로 관리하지 못하는 구조적인 문제에서 비롯됩니다. <br/><br/>기존의 식재료 관리 서비스는 사용자가 직접 정보를 입력해야 하는 번거로움으로 인해 지속적인 사용이 어렵고, 마트 POS 시스템 연동 방식 또한 포인트 적립 참여율이 낮아 실효성이 떨어진다는 한계를 가지고 있습니다. <br/><br/>이러한 문제를 해결하기 위해 본 프로젝트는 NFC 기반의 식재료 관리 서비스 Sangle을 설계하였습니다. 휴대폰 터치 한 번으로 포인트 적립과 구매 영수증 데이터를 불러와 식재료의 소비 기한을 자동으로 관리할 수 있도록 하였으며, 소비 패턴을 분석해 음식물 쓰레기 발생량을 시각화하고 AI를 통해 적정 구매량을 추천합니다. <br/><br/>또한 프로젝트 재구축 과정에서 하드웨어 의존도를 줄이고 POS 업체와의 B2B 구조로 비즈니스 모델을 재설계하여 서비스의 확장성과 현실적인 도입 가능성을 높였습니다. 이를 통해 사용자의 행동 부담을 최소화하면서도 음식물 쓰레기 문제를 구조적으로 완화하는 지속 가능한 시스템을 제안합니다.",
        skills:
            "React Native, Swift, ESP32, Bluetooth, Embedded web server, Laravel(php), NFC",
        joins:
            "1차. 홍예훈(PM, 하드웨어, AI), 조성훈(백엔드), 권지원(앱개발), 김대현(디자인) 2차. 홍예훈(프론트, 백엔드, 하드웨어, AI))",
    },
    // {
    //   count: 2,
    //   ...
    // }
];
