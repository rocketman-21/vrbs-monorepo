import { SVGProps } from "react";

const SvgLabelAlt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 5H2v14h14v-2h2v-2h2v-2h2v-2h-2V9h-2V7h-2V5Zm0 2v2h2v2h2v2h-2v2h-2v2H4V7h12Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLabelAlt;
