import { SVGProps } from "react";

const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m9.718 2.723-4.5 4.746A.731.731 0 0 0 5 8c0 .187.062.375.218.53l4.5 4.747c.282.281.75.313 1.032 0a.718.718 0 0 0 .03-1.061L6.782 8l4-4.216a.718.718 0 0 0-.031-1.061c-.282-.313-.75-.281-1.032 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronLeft;
