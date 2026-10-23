// 소개 / 연락처 페이지에 들어가는 개인 정보. 내용 수정은 이 파일에서만 하면 됨
// 화면 고정 문구(버튼, 안내문 등)는 i18n/messages.ts
import type { Localized } from "../i18n/lang.ts";

export interface Career {
    school: Localized;
    details: Localized[];
}

export const CAREERS: Career[] = [
    {
        school: { ko: "선린인터넷고등학교 소프트웨어과", en: "Sunrin Internet High School, Dept. of Software" },
        details: [
            { ko: "웹앱 개발 전공동아리 TAPIE 부장", en: "President, TAPIE (Web & App Development Club)" },
            { ko: "119대 전교부회장", en: "Vice President, 119th Student Council" },
        ],
    },
    {
        school: { ko: "성균관대학교 공학계열", en: "Sungkyunkwan University, Engineering" },
        details: [
            { ko: "멋쟁이사자처럼 대학 성균관 자연과학 캠퍼스 대표", en: "Chapter Lead, LIKELION Univ. SKKU Natural Sciences Campus" },
        ],
    },
];

export const AWARDS: Localized[] = [
    { ko: "Smarteen app challenge 2024 우수상", en: "Smarteen App Challenge 2024 — Excellence Award" },
    { ko: "AppJam 24회 미래부문 최우수상", en: "AppJam #24 — Top Prize, Future Track" },
    { ko: "AppJam 27회 생활부문 최우수상", en: "AppJam #27 — Top Prize, Lifestyle Track" },
    { ko: "2024 직업계고 창의 아이디어 경진대회 금상", en: "2024 Vocational High School Creative Idea Competition — Gold Prize" },
    { ko: "2025 직업계고 창의 아이디어 경진대회 동상", en: "2025 Vocational High School Creative Idea Competition — Bronze Prize" },
    { ko: "선린 해커톤 11회 금상", en: "Sunrin Hackathon #11 — Gold Prize" },
];

export type ShapeKind = "circle" | "square" | "rect" | "pill" | "triangle" | "hexagon" | "star";

export interface Skill {
    name: string;      // 영어 표기 그대로 두 언어에서 사용. 띄어쓰기가 있으면 도형에 맞춰 여러 줄로 나뉠 수 있음
    level: number;     // 클수록 도형과 글자가 커짐
    shape?: ShapeKind; // 지정하지 않으면 이름 길이에 맞춰 자동 배정
}

export const SKILLS: Skill[] = [
    { name: "Research", level: 9, shape: "triangle" },
    { name: "Product Strategy", level: 12, shape: "rect" },
    { name: "UX/UI Design", level: 13, shape: "star" },
    { name: "Prototyping", level: 10, shape: "square" },
    { name: "Development", level: 13, shape: "circle" },
    { name: "Physical Computing", level: 11, shape: "pill" },
    { name: "Leadership", level: 9, shape: "hexagon" },
    { name: "Business Development", level: 10, shape: "pill" },
];

export const EMAIL = "hg.yehoon@gmail.com";

export const CONTACTS = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Instagram", value: "@yehoonhong", href: "https://www.instagram.com/yehoonhong" },
    { label: "LinkedIn", value: "@yehoonhong", href: "https://www.linkedin.com/in/yehoonhong" },
];
