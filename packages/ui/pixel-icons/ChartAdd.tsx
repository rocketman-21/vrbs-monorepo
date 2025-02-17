import { SVGProps } from "react";

const SvgChartAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h10v2H5v14h14v-8h2v10H3V3Zm6 8H7v6h2v-6Zm2-4h2v10h-2V7Zm6 6h-2v4h2v-4Zm0-10h2v2h2v2h-2v2h-2V7h-2V5h2V3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChartAdd;
