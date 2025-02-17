import { SVGProps } from "react";

const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPlay;
