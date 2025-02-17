import { SVGProps } from "react";

const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h11v2H6v13H4V2Zm4 4h12v16H8V6Zm2 2v12h8V8h-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCopy;
