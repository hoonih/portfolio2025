const TOPBAR_HEIGHT = 85; // px (Logo + 버튼 영역 포함해서 여유있게)
export const CONNECT_SECTION_ID = "connect";

export const scrollToConnect = () => {
    const el = document.getElementById(CONNECT_SECTION_ID);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - TOPBAR_HEIGHT;
    window.scrollTo({ top, behavior: "smooth" });
};
