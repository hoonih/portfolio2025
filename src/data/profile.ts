// 소개 / 연락처 페이지에 들어가는 개인 정보. 내용 수정은 이 파일에서만 하면 됨

export interface Career {
    school: string;
    details: string[];
}

export const CAREERS: Career[] = [
    {
        school: "선린인터넷고등학교 소프트웨어과",
        details: ["웹앱 개발 전공동아리 TAPIE 부장", "119대 전교부회장"],
    },
    {
        school: "성균관대학교 공학계열",
        details: ["멋쟁이사자처럼 대학 성균관 자연과학 캠퍼스 대표"],
    },
];

export const AWARDS = [
    "Smarteen app challenge 2024 우수상",
    "AppJam 24회 미래부문 최우수상",
    "AppJam 27회 생활부문 최우수상",
    "2024 직업계고 창의 아이디어 경진대회 금상",
    "2025 직업계고 창의 아이디어 경진대회 동상",
    "선린 해커톤 11회 금상",
];

// level이 클수록 공이 커짐
export const SKILLS = [
    { name: "React native", level: 14 },
    { name: "Android", level: 10 },
    { name: "React", level: 12 },
    { name: "Laravel", level: 5 },
    { name: "TypeScript", level: 7 },
    { name: "C++", level: 7 },
    { name: "Python", level: 6 },
    { name: "Figma", level: 6 },
    { name: "Notion", level: 6 },
    { name: "Arduino", level: 8 },
];

export const EMAIL = "hg.yehoon@gmail.com";

export const CONTACTS = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Instagram", value: "@yehoonhong", href: "https://www.instagram.com/yehoonhong" },
    { label: "LinkedIn", value: "@yehoonhong", href: "https://www.linkedin.com/in/yehoonhong" },
];

export const CONTACT_TOPICS = ["협업", "외주", "커피챗", "프로젝트 문의"];
