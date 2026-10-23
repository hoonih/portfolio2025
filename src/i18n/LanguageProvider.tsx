import { useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LANG, LANGS, type Lang } from "./lang.ts";
import { LanguageContext } from "./languageContext.ts";

const STORAGE_KEY = "lang";

// 마지막으로 고른 언어를 기억 (저장소를 못 쓰는 환경이면 기본값)
const readStoredLang = (): Lang => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return LANGS.includes(stored as Lang) ? (stored as Lang) : DEFAULT_LANG;
    } catch {
        return DEFAULT_LANG;
    }
};

const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Lang>(readStoredLang);

    useEffect(() => {
        document.documentElement.lang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // 저장 실패는 무시 (이번 방문 동안만 유지)
        }
    }, [lang]);

    return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
