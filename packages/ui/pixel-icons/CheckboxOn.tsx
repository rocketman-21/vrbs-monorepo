import { SVGProps } from "react";

const SvgCheckboxOn = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 16V5H5v14h14Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheckboxOn;
