import { createContext, useContext } from "react";
import { DEFAULT_LANG, type Lang } from "./lang.ts";
import { MESSAGES } from "./messages.ts";

interface LanguageContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({ lang: DEFAULT_LANG, setLang: () => {} });

export const useLanguage = () => {
    const { lang, setLang } = useContext(LanguageContext);
    return { lang, setLang, t: MESSAGES[lang] };
};
