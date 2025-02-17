import { SVGProps } from "react";

const SvgAnalytics = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 2H5v14h14V5ZM7 12h2v5H7v-5Zm10-5h-2v10h2V7Zm-6 3h2v2h-2v-2Zm2 4h-2v3h2v-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAnalytics;
