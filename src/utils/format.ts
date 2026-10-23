// "2025-03-01" → "2025.03.01"
export const formatDate = (date: string) => date.replace(/-/g, ".");

// "https://www.velog.io/..." → "velog.io"
export const hostLabel = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};
