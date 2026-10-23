import type { Lang } from "./lang.ts";

// 화면 고정 문구. 프로젝트 내용은 어드민(projects.json)에서, 경력·수상은 data/profile.ts에서 관리
// 문자열 안의 **굵게**는 강조, \n은 줄바꿈으로 표시됨

const en = {
    languageToggle: "한국어로 보기",
    intro: "I aim to deliver value through **IT services** that have a viable **Business Model**, achieved by fusing various IT technologies based on my broad interdisciplinary study.",
    banner: {
        title: "I design technical solutions to social problems,\nbuild them into web and app services, and weave them naturally into everyday life.",
        cta: "View Portfolio",
    },
    connect: {
        topics: ["Collaboration", "Freelance", "Coffee Chat", "Project Inquiry"],
        lead: "Have a new idea or a problem you'd like to solve together? Feel free to reach out.",
        copy: "Copy email address",
        copied: "Copied ✓",
    },
    portfolio: {
        categories: "Categories",
        close: "Close",
        skills: "Skills",
        team: "Team",
        slides: "Slides",
        posts: "Posts",
        showPosts: "Show posts",
        openInNewTab: "Open in new tab ↗",
        loadingSlides: "Loading slides...",
        slidesError: "Couldn't load the slides.",
        noSlides: "No slides yet.",
        noPosts: "No posts yet.",
        blog: "Blog",
        page: (n: number) => `Page ${n}`,
    },
    post: {
        notFound: "Post not found.",
        backToPortfolio: "← Back to portfolio",
        loading: "Loading...",
        empty: "This post has no content yet.",
    },
};

export type Messages = typeof en;

const ko: Messages = {
    languageToggle: "View in English",
    intro: "폭넓은 융합적 학습을 바탕으로 다양한 IT 기술을 결합해, 지속 가능한 **비즈니스 모델**을 갖춘 **IT 서비스**로 가치를 전달하는 것을 목표로 합니다.",
    banner: {
        title: "사회 문제의 기술적 솔루션을 설계하고\n웹앱 서비스로 구현하며 사람들의 일상 속에 자연스럽게 녹여냅니다.",
        cta: "포트폴리오 보러가기",
    },
    connect: {
        topics: ["협업", "외주", "커피챗", "프로젝트 문의"],
        lead: "새로운 아이디어나 함께 풀고 싶은 문제가 있다면 편하게 연락주세요.",
        copy: "이메일 주소 복사",
        copied: "복사되었어요 ✓",
    },
    portfolio: {
        categories: "분류",
        close: "닫기",
        skills: "스킬",
        team: "팀",
        slides: "발표자료",
        posts: "회고 · 블로그",
        showPosts: "회고 · 블로그 보기",
        openInNewTab: "새 탭에서 열기 ↗",
        loadingSlides: "발표자료를 불러오는 중...",
        slidesError: "발표자료를 불러오지 못했어요.",
        noSlides: "아직 등록된 발표자료가 없어요.",
        noPosts: "아직 작성된 회고나 블로그 글이 없어요.",
        blog: "블로그",
        page: (n: number) => `${n}페이지`,
    },
    post: {
        notFound: "글을 찾을 수 없어요.",
        backToPortfolio: "← 포트폴리오로",
        loading: "불러오는 중...",
        empty: "아직 본문이 없어요.",
    },
};

export const MESSAGES: Record<Lang, Messages> = { en, ko };
