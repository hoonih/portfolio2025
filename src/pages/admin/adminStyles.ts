import styled from "styled-components";

// 어드민 공통 입력창/버튼 스타일

export const inputStyle = `
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #2A2A2A;
    border-radius: 8px;
    background: #0A0A0A;
    color: #FFF;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
    outline: none;

    &:focus {
        border-color: #7A7A7A;
    }
`;

export const Input = styled.input`${inputStyle}`;

export const buttonStyle = `
    padding: 9px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

export const PrimaryButton = styled.button`
    ${buttonStyle}
    border: 0;
    background: #FFF;
    color: #0A0A0A;
`;

export const GhostButton = styled.button`
    ${buttonStyle}
    border: 1px solid #2A2A2A;
    background: transparent;
    color: #FFF;

    &:hover:not(:disabled) {
        background: #1E1E1E;
    }
`;
