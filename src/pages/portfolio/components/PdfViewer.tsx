import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useLanguage } from "../../../i18n/languageContext.ts";

GlobalWorkerOptions.workerSrc = workerUrl;

interface Props {
    url: string;
}

// pdf.js로 페이지를 캔버스에 그림 (iOS Safari의 iframe PDF는 첫 페이지만 보이는 문제가 있어서)
const PdfViewer = ({ url }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
    const [ratio, setRatio] = useState(9 / 16); // 첫 페이지 기준 세로/가로 비율 (자리 잡기용)
    const [width, setWidth] = useState(0);
    const [error, setError] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        let cancelled = false;
        const task = getDocument({ url });
        task.promise
            .then(async (pdf) => {
                const first = await pdf.getPage(1);
                const viewport = first.getViewport({ scale: 1 });
                if (cancelled) return;
                setRatio(viewport.height / viewport.width);
                setDoc(pdf);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });
        return () => {
            cancelled = true;
            task.destroy();
        };
    }, [url]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Container ref={containerRef}>
            {error && <Status>{t.portfolio.slidesError}</Status>}
            {!error && !doc && <Status>{t.portfolio.loadingSlides}</Status>}
            {doc && width > 0 && Array.from({ length: doc.numPages }, (_, i) => (
                <PdfPage key={i} doc={doc} pageNumber={i + 1} width={width} ratio={ratio} />
            ))}
        </Container>
    );
};

export default PdfViewer;

interface PageProps {
    doc: PDFDocumentProxy;
    pageNumber: number;
    width: number;
    ratio: number;
}

// 화면 근처에 왔을 때만 렌더링해서 페이지가 많아도 가볍게
const PdfPage = ({ doc, pageNumber, width, ratio }: PageProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(false);
    const [rendered, setRendered] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!wrapperRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "800px 0px" },
        );
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible || !canvasRef.current) return;
        let task: RenderTask | null = null;
        let cancelled = false;

        doc.getPage(pageNumber).then((page) => {
            if (cancelled || !canvasRef.current) return;
            const canvas = canvasRef.current;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: (width / base.width) * dpr });
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            task = page.render({ canvas, viewport });
            task.promise.then(() => !cancelled && setRendered(true)).catch(() => {});
        });

        return () => {
            cancelled = true;
            task?.cancel();
        };
    }, [doc, pageNumber, width, visible]);

    return (
        <PageWrapper ref={wrapperRef} style={{ aspectRatio: `1 / ${ratio}` }} $rendered={rendered}>
            <canvas ref={canvasRef} aria-label={t.portfolio.page(pageNumber)} />
        </PageWrapper>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
`;

const Status = styled.p`
    padding: 48px 0;
    color: #7A7A7A;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
`;

const PageWrapper = styled.div<{ $rendered: boolean }>`
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background: ${props => props.$rendered ? "transparent" : "#1E1E1E"};

    canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
`;
