import { SVGProps } from "react";

const SvgSort = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 20H6V8H4V6h2V4h2v2h2v2H8v12Zm2-12v2h2V8h-2ZM4 8v2H2V8h2Zm14-4h-2v12h-2v-2h-2v2h2v2h2v2h2v-2h2v-2h2v-2h-2v2h-2V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSort;
