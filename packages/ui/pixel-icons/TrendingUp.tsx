import { SVGProps } from "react";

const SvgTrendingUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 6h8v8h-2v-4h-2V8h-4V6Zm2 6v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm-2 0h2v2h-2v-2Zm-2-2h2v2h-2v-2Zm-2 0v-2h2v2H8Zm-2 2v-2h2v2H6Zm-2 2v-2h2v2H4Zm0 0v2H2v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTrendingUp;
