import { SVGProps } from "react";

const SvgCast = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3h18v18h-8v-2h6V5H4v4H2V3h2Zm0 16H2v2h2v-2Zm-2-4h4v2H2v-2Zm8-4H2v2h8v8h2V11h-2Zm-4 4h2v6H6v-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCast;
