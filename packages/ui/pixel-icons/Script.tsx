import { SVGProps } from "react";

const SvgScript = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 3h14v2h2v6h-2v8h-2V5H6V3Zm8 14v-2H6V5H4v10H2v4h2v2h14v-2h-2v-2h-2Zm0 0v2H4v-2h10Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgScript;
