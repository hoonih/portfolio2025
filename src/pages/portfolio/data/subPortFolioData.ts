import SampleImg from "../../../assets/sampleImage.jpg";
import Theia from "../../../assets/portfolioimg/sub/theia.png"
import HomeFood from "../../../assets/portfolioimg/sub/homefood.png"
import SunrinTon from "../../../assets/portfolioimg/sub/SunrinTon.png"
import Thumber from "../../../assets/portfolioimg/sub/thumber.png"
import Hugle from "../../../assets/portfolioimg/sub/hugle.png"
import lilag from "../../../assets/portfolioimg/sub/lilag.png"
import snackaudiobook from "../../../assets/portfolioimg/sub/snackaudiobook.png"

export interface SubPortfolioData {
    count: number;
    subtitle: string;
    title: string;
    image: string;
    description: string;
    skills: string;
    joins: string;
}

export const subPortfolioData: SubPortfolioData[] = [
    {
        count: 1,
        subtitle: "SNS에 지친 사람들을 위한 감정기반 소셜 서비스",
        title: "Theia",
        image: Theia,
        description:
"기존 소셜 미디어는 관계 중심의 소셜 네트워킹에서 벗어나 콘텐츠 소비와 자기 과시에 집중하는 구조로 변화하며, 사용자에게 피로감과 관계의 왜곡을 만들어왔습니다. 알고리즘 중심의 노출 경쟁과 과도한 자기 관리 속에서 많은 사용자들이 진솔한 감정 표현과 의미 있는 소통을 잃어가고 있습니다. <br/><br/>THEIA는 이러한 문제의식에서 출발한 감정 중심 소셜 네트워킹 서비스입니다. 사용자는 일상의 감정과 추억을 글, 사진, 영상으로 편하게 기록하고 공유할 수 있으며, 콘텐츠는 상호 동의한 친구에게만 공개됩니다. 이를 통해 THEIA는 비교와 과시가 아닌 공감과 지지를 기반으로 한 건강한 관계 형성을 목표로 합니다."
    ,
    skills:
            "ReactNative, SpringBoot",
        joins:
            "홍예훈(PM/개발자), 김세빛(브랜딩 디자이너), 김대현(UI/UX 디자이너)",
    },
    {
        count: 2,
        subtitle: "1인 가구를 위한 반찬 정기 구독 서비스",
        title: "집밥의정석",
        image: HomeFood,
        description:
            "바쁜 일상 속에서 집밥을 꾸준히 챙기는 것은 많은 사람들에게 시간과 체력의 부담으로 작용합니다. 특히 1인 가구와 맞벌이 가정은 매번 식단을 고민하고 반찬을 준비하는 과정에서 집밥을 포기하게 되는 경우가 많습니다. <br/><br/>집밥의 정석은 이러한 문제를 해결하기 위해 반찬 정기 구독 서비스를 기획한 프로젝트입니다. 사용자는 자신의 생활 패턴과 취향에 맞는 반찬을 정기적으로 받아볼 수 있으며, 복잡한 준비 과정 없이도 균형 잡힌 집밥을 유지할 수 있도록 설계되었습니다. 이를 통해 집밥을 ‘노력해야 하는 일’이 아닌, 일상 속에서 자연스럽게 지속 가능한 선택으로 만드는 것을 목표로 합니다.",
        skills:
            "ReactNative, React Vite",
        joins:
            "홍예훈(프론트엔드), 이주영(디자인), 조성훈(백엔드)",
    },
    {
        count: 3,
        subtitle: "비언어적 표현 기반 메신저",
        title: "건강한 프로젝트 소통 문화 솔루션",
        image: SunrinTon,
        description:
            "온라인 협업 환경에서는 텍스트 중심의 소통으로 인해 상대방의 감정이 제대로 전달되지 않아 오해와 갈등이 발생하기 쉽습니다. 특히 팀 프로젝트 과정에서 비언어적 신호의 부재는 소통의 질을 저하시키는 주요 원인으로 작용합니다. <br/><br/>본 프로젝트는 업무용 채팅 플랫폼에 비언어적 감정 표현을 결합한 소통 솔루션을 설계한 프로젝트입니다. 사용자의 프로필 사진을 기반으로 감정별 얼굴 이미지를 사전에 생성하고, 텍스트 입력 시 음성과 자음·모음 발음 정보를 활용해 입 모양이 자연스럽게 움직이는 프로필 애니메이션을 구현했습니다. <br/><br/>기존 AI 영상 생성 방식의 높은 지연 시간을 개선하기 위해 음성 생성과 입 모양 생성 과정을 분리하여 재설계하였으며, 프레임 매핑과 보간 기법을 적용해 상호작용 지연을 2~3초 이내로 단축했습니다. 이를 통해 빠른 반응성이 요구되는 협업 환경에서도 감정이 전달되는 건강한 소통 경험을 제안합니다.",
        skills:
            "NextJS, SpringBoot, FastAPI, FFmpeg, Python, ElevenAPI",
        joins:
            "홍예훈(시스템 설계, 개발), 이주영(디자인), 권지원(프론트엔드), 조성훈(백엔드)",
    },
    {
        count: 4,
        subtitle: "텀블러 리바운드 효과를 줄이기 위한 텀블러 대여 서비스",
        title: "텀대서",
        image: Thumber,
        description:
            "지구 온난화와 해양 오염 문제의 주요 원인 중 하나인 일회용 플라스틱 사용을 줄이기 위해 텀블러 사용이 확산되고 있지만, 텀블러의 과도한 생산과 구매는 오히려 환경 부담을 증가시키는 리바운드 효과를 초래하고 있습니다. 기존의 ‘소유 중심’ 해결 방식은 일회용 플라스틱 문제를 근본적으로 완화하기에 한계를 지닙니다. <br/><br/>본 프로젝트는 이러한 리바운드 효과를 억제하기 위해 텀블러를 구매가 아닌 대여 방식으로 이용할 수 있는 자동화 자판기를 설계/제작한 프로젝트입니다. 라즈베리파이와 아두이노를 기반으로 시스템을 구성하고, 리니어 액추에이터를 활용해 텀블러의 대여·반납 과정을 자동화하였습니다. 이를 통해 사용자의 접근성을 높이면서도 불필요한 텀블러 생산을 줄이는 지속 가능한 대안을 제안합니다.",
        skills:
            "Android, raspberry pi, arduino, linear actuators, motor controller",
        joins:
            "홍예훈(시스템 설계/개발), 김대현(디자인), 문제원(앱/서버 구축)",
    },
    {
        count: 5,
        subtitle: "아이의 마음을 알아주는 AI 인형",
        title: "HUGLE",
        image: Hugle,
        description:
            "맞벌이 가정과 핵가족 환경이 늘어나면서 부모가 아이의 감정 변화를 지속적으로 살피기 어려운 문제가 발생하고 있습니다. 특히 아이가 느끼는 불안이나 고민은 겉으로 드러나지 않는 경우가 많아, 적절한 정서적 케어가 늦어지기 쉽습니다. <br/><br/>Hugle은 이러한 문제를 해결하기 위해 설계된 AI 기반 정서 교감 인형입니다. 아이가 인형과 자유롭게 대화하며 감정을 표현하면, 음성 인식과 대화형 AI를 통해 아이의 감정을 공감하고 안정적인 정서적 지지를 제공합니다. 대화 내용은 보호자가 지정한 상담사에게 전달되어 아이의 정서 상태를 이해하고 적절한 피드백을 제공할 수 있도록 돕습니다. <br/><br/>Hugle은 단순한 대화형 장난감을 넘어, 아이·부모·전문가를 연결하는 정서 케어 플랫폼으로서 아이가 안전하고 건강한 환경에서 자신의 감정을 표현할 수 있도록 지원하는 것을 목표로 합니다.",
        skills:
            "ReactNative, Swift, OpenCV, ChatGPT API, FastAPI, WebRTC, Oracle Cloud, Docker",
        joins:
            "홍예훈(PM, 웹개발), 유도윤(앱), 조성훈(백엔드), 이정훈(AI), 김대현(디자인)",
    },
];
