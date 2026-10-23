import styled from "styled-components";
import type { Project } from "../data/projects.ts";
import { media } from "../../../styles/media.ts";

interface Props {
    project: Project;
    pinned?: boolean; // MAIN 프로젝트 — 연도 목록 맨 앞 고정 + 배지 표시
    onSelect: (project: Project) => void;
}

const ProjectCard = ({ project, pinned = false, onSelect }: Props) => {
    const content = (
        <>
            <Thumbnail>
                {pinned && <PinnedBadge>MAIN</PinnedBadge>}
                {project.image
                    ? <img src={project.image} alt={project.title} loading="lazy" />
                    : <Placeholder>{project.title}</Placeholder>}
            </Thumbnail>
            <Title>
                {project.title}
                <Year>{project.year}</Year>
            </Title>
            <Subtitle>{project.subtitle}</Subtitle>
        </>
    );

    if (project.link) {
        return (
            <Card as="a" href={project.link} target="_blank" rel="noopener noreferrer">
                {content}
            </Card>
        );
    }

    return (
        <Card type="button" onClick={() => onSelect(project)}>
            {content}
        </Card>
    );
};

export default ProjectCard;

const Card = styled.button`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;

    &:hover img {
        transform: scale(1.04);
    }
`;

const Thumbnail = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: #191919;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }
`;

const PinnedBadge = styled.span`
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 1;
    padding: 4px 8px;
    border-radius: 999px;
    background: #FFF;
    color: #0A0A0A;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;

    ${media.mobile} {
        top: 6px;
        left: 6px;
        padding: 3px 6px;
        font-size: 10px;
    }
`;

const Placeholder = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: #FFF;
    font-size: 20px;
    font-weight: 600;
    text-align: center;

    ${media.mobile} {
        font-size: 16px;
    }
`;

const Title = styled.p`
    color: #FFF;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;

    ${media.mobile} {
        font-size: 15px;
    }
`;

const Year = styled.span`
    margin-left: 8px;
    color: #7A7A7A;
    font-size: 0.8em;
    font-weight: 500;
`;

const Subtitle = styled.p`
    color: #C9C9C9;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.4;
    word-break: keep-all;

    ${media.mobile} {
        font-size: 13px;
    }
`;
