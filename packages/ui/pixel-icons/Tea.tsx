import { SVGProps } from "react";

const SvgTea = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h18v7h-4v5H4V4Zm14 5h2V6h-2v3Zm-2-3h-4v2h2v4H8V8h2V6H6v8h10V6Zm3 12v2H3v-2h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTea;
