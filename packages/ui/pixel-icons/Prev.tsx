import { SVGProps } from "react";

const SvgPrev = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4h2v16H6V4Zm12 0h-2v2h-2v3h-2v2h-2v2h2v3h2v2h2v2h2V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPrev;
