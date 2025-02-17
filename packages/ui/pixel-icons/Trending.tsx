import { SVGProps } from "react";

const SvgTrending = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4h2v14h16v2H3V4Zm6 10H7v2h2v-2Zm2-2v2H9v-2h2Zm2 0v-2h-2v2h2Zm2 0h-2v2h2v-2Zm2-2h-2v2h2v-2Zm2-2v2h-2V8h2Zm0 0V6h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTrending;
