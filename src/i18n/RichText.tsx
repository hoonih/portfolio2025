import { Fragment } from "react";

// 번역 문구의 **굵게**를 <strong>으로, \n을 <br />로 바꿔서 표시
const RichText = ({ text }: { text: string }) => (
    <>
        {text.split("\n").map((line, i) => (
            <Fragment key={i}>
                {i > 0 && <br />}
                {line.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
            </Fragment>
        ))}
    </>
);

export default RichText;
