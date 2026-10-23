import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import MarkdownView from "../../components/MarkdownView.tsx";
import { findPost } from "../../data/projects.ts";
import { portfolioState } from "../portfolio/portfolioState.ts";
import { formatDate } from "../../utils/format.ts";
import { media } from "../../styles/media.ts";

// 글 본문은 글마다 따로 불러옴 (메인 번들에 포함되지 않음)
const postBodies = import.meta.glob<string>("../../content/posts/*.md", { query: "?raw", import: "default" });

const PostPage = () => {
    const { slug = "" } = useParams();
    const found = findPost(slug);
    const [loaded, setLoaded] = useState<{ slug: string; text: string } | null>(null);
    const loader = postBodies[`../../content/posts/${slug}.md`];
    // 본문 파일이 없으면 빈 글, 불러오는 중이면 null
    const markdown = !loader ? "" : loaded?.slug === slug ? loaded.text : null;

    useEffect(() => {
        if (!loader) return;
        let cancelled = false;
        loader().then(text => !cancelled && setLoaded({ slug, text }));
        return () => {
            cancelled = true;
        };
    }, [slug, loader]);

    useEffect(() => {
        if (found) document.title = `${found.post.title} | YeHoonHong`;
        return () => {
            document.title = "YeHoonHong";
        };
    }, [found]);

    return (
        <Page>
            <Main>
                {!found
                    ? (
                        <NotFound>
                            <p>글을 찾을 수 없어요.</p>
                            <BackLink to="/portfolio">← 포트폴리오로</BackLink>
                        </NotFound>
                    )
                    : (
                        <>
                            <BackLink to="/portfolio" state={portfolioState(found.project.id, "posts")}>
                                ← {found.project.title}
                            </BackLink>
                            <PostHeader>
                                <Title>{found.post.title}</Title>
                                {found.post.date && <PostDate>{formatDate(found.post.date)}</PostDate>}
                            </PostHeader>
                            {markdown === null
                                ? <Status>불러오는 중...</Status>
                                : markdown.trim()
                                    ? <MarkdownView markdown={markdown} />
                                    : <Status>아직 본문이 없어요.</Status>}
                        </>
                    )}
            </Main>
        </Page>
    );
};

export default PostPage;

const Page = styled.div`
    min-height: 100vh;
    background: #0A0A0A;
`;

const Main = styled.main`
    max-width: 760px;
    margin: 0 auto;
    padding: calc(var(--header-height) + 24px) 16px 120px;

    ${media.mobile} {
        padding-top: calc(var(--header-height) + 8px);
    }
`;

const BackLink = styled(Link)`
    display: inline-block;
    margin-bottom: 24px;
    color: #9F9F9F;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
`;

const PostHeader = styled.header`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid #262626;
`;

const Title = styled.h1`
    color: #FFF;
    font-size: 40px;
    font-weight: 700;
    line-height: 1.3;
    word-break: keep-all;

    ${media.mobile} {
        font-size: 28px;
    }
`;

const PostDate = styled.p`
    color: #7A7A7A;
    font-size: 15px;
    font-weight: 400;
`;

const Status = styled.p`
    padding: 48px 0;
    color: #7A7A7A;
    font-size: 15px;
    font-weight: 400;
    text-align: center;
`;

const NotFound = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    color: #FFF;
    font-size: 20px;
    font-weight: 600;
`;
