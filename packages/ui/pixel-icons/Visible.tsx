import { SVGProps } from "react";

const SvgVisible = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 6h8v2H8V6Zm-4 4V8h4v2H4Zm-2 2v-2h2v2H2Zm0 2v-2H0v2h2Zm2 2H2v-2h2v2Zm4 2H4v-2h4v2Zm8 0v2H8v-2h8Zm4-2v2h-4v-2h4Zm2-2v2h-2v-2h2Zm0-2h2v2h-2v-2Zm-2-2h2v2h-2v-2Zm0 0V8h-4v2h4Zm-10 1h4v4h-4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVisible;
