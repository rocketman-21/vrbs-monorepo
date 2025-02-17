import { SVGProps } from "react";

const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m6.282 2.723 4.5 4.746A.73.73 0 0 1 11 8a.73.73 0 0 1-.219.53l-4.5 4.747c-.28.281-.75.313-1.03 0a.718.718 0 0 1-.032-1.061L9.22 8l-4-4.216a.718.718 0 0 1 .031-1.061c.282-.313.75-.281 1.032 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronRight;
