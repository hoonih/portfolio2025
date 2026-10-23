export const LANGS = ["en", "ko"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

// 언어별 문구가 필요한 콘텐츠 (경력, 수상 등)
export type Localized = Record<Lang, string>;
