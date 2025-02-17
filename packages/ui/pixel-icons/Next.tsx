import { SVGProps } from "react";

const SvgNext = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4Zm12 0h-2v16h2V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNext;
