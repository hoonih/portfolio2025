// 반응형 브레이크포인트 (max-width 기준, 데스크톱 퍼스트)
export const breakpoints = {
    tablet: 1024,
    mobile: 768,
    small: 480,
};

export const media = {
    tablet: `@media (max-width: ${breakpoints.tablet}px)`,
    mobile: `@media (max-width: ${breakpoints.mobile}px)`,
    small: `@media (max-width: ${breakpoints.small}px)`,
};
