import { SVGProps } from "react";

const SvgMap = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2h2v2h2v2h-2v10H8V6H6V4h2V2ZM4 8V6h2v2H4Zm2 10v2H4v2H2V8h2v10h2Zm0 0h2v-2H6v2Zm6 0h-2v-2h2v2Zm2-10V6h-2v2h2Zm2 0h-2v10h-2v2h2v2h2v-2h2v-2h2v-2h2V2h-2v2h-2v2h-2v2Zm0 0h2V6h2v10h-2v2h-2V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMap;
