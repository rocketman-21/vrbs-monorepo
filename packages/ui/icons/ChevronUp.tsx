import { SVGProps } from "react";

const SvgChevronUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m2.723 9.719 4.746-4.5A.731.731 0 0 1 8 4.999c.187 0 .375.063.53.22l4.747 4.5c.281.28.313.75 0 1.03a.718.718 0 0 1-1.061.032L8 6.781l-4.216 4a.718.718 0 0 1-1.061-.031c-.313-.281-.281-.75 0-1.031Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronUp;
