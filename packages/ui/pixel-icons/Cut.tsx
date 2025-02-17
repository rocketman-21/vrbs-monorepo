import { SVGProps } from "react";

const SvgCut = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h2v2H2V2Zm4 4H4V4h2v2Zm2 2H6V6h2v2Zm2 2V8H8v2h2Zm4 0h-4v4H2v8h8v-8h4v8h8v-8h-8v-4Zm2-2v2h-2V8h2Zm2-2v2h-2V6h2Zm2-2h-2v2h2V4Zm0 0V2h2v2h-2ZM4 20v-4h4v4H4Zm12 0v-4h4v4h-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCut;
