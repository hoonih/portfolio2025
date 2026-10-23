import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { media } from "../styles/media.ts";

interface Props {
    markdown: string;
}

// 블로그 글 본문 렌더링 (사이트 글 페이지와 어드민 미리보기에서 같이 사용)
// react-markdown은 HTML을 그대로 실행하지 않아서 안전함
const MarkdownView = ({ markdown }: Props) => (
    <Article>
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ href, children }) => {
                    const external = !!href && /^https?:\/\//.test(href);
                    return (
                        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                            {children}
                        </a>
                    );
                },
                img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" />,
            }}
        >
            {markdown}
        </Markdown>
    </Article>
);

export default MarkdownView;

const Article = styled.article`
    color: #E6E6E6;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.8;
    word-break: keep-all;
    overflow-wrap: anywhere;

    ${media.mobile} {
        font-size: 16px;
    }

    & > *:first-child {
        margin-top: 0;
    }

    h1, h2, h3, h4 {
        color: #FFF;
        font-weight: 700;
        line-height: 1.4;
    }
    h1 { margin: 48px 0 16px; font-size: 30px; }
    h2 { margin: 40px 0 14px; font-size: 24px; }
    h3 { margin: 32px 0 12px; font-size: 20px; }
    h4 { margin: 24px 0 8px; font-size: 18px; }

    ${media.mobile} {
        h1 { font-size: 24px; }
        h2 { font-size: 21px; }
        h3 { font-size: 18px; }
    }

    p {
        margin: 0 0 18px;
    }

    strong {
        color: #FFF;
        font-weight: 700;
    }

    em {
        font-style: italic;
    }

    del {
        text-decoration: line-through;
    }

    a {
        color: #FFF;
        text-decoration: underline;
        text-underline-offset: 3px;
        cursor: pointer;
    }

    ul, ol {
        margin: 0 0 18px;
        padding-left: 24px;
    }
    ul { list-style: disc; }
    ol { list-style: decimal; }
    li { margin: 4px 0; }
    li > ul, li > ol { margin: 4px 0; }

    blockquote {
        margin: 0 0 18px;
        padding: 4px 0 4px 16px;
        border-left: 3px solid #3A3A3A;
        color: #A8A8A8;
    }

    code {
        padding: 2px 6px;
        border-radius: 4px;
        background: #1E1E1E;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.9em;
    }

    pre {
        margin: 0 0 18px;
        padding: 16px;
        border-radius: 8px;
        background: #161616;
        overflow-x: auto;
        line-height: 1.6;

        code {
            padding: 0;
            background: none;
        }
    }

    img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 24px auto;
        border-radius: 8px;
    }

    hr {
        margin: 40px 0;
        border: 0;
        border-top: 1px solid #262626;
    }

    table {
        display: block;
        width: max-content;
        max-width: 100%;
        margin: 0 0 18px;
        overflow-x: auto;
        font-size: 15px;
    }
    th, td {
        padding: 8px 12px;
        border: 1px solid #2A2A2A;
        text-align: left;
    }
    th {
        background: #1A1A1A;
        color: #FFF;
        font-weight: 600;
    }
`;
