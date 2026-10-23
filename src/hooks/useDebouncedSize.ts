import { useEffect, useRef, useState } from "react";

interface Size {
    width: number;
    height: number;
}

// 요소 크기를 관찰하다가 delay 동안 변화가 없으면 확정된 크기를 돌려줌 (변하는 중에는 null)
// threshold 이하의 미세한 변화(모바일 주소창 등)는 무시
export const useDebouncedSize = <T extends HTMLElement>(delay = 500, threshold = 5) => {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<Size | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let committed: Size | null = null;
        let timer: number | undefined;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (
                committed
                && Math.abs(width - committed.width) < threshold
                && Math.abs(height - committed.height) < threshold
            ) return;

            committed = { width, height };
            setSize(null);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => setSize(committed), delay);
        });

        observer.observe(el);
        return () => {
            observer.disconnect();
            window.clearTimeout(timer);
        };
    }, [delay, threshold]);

    return [ref, size] as const;
};
