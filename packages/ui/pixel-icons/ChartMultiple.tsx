import { SVGProps } from "react";

const SvgChartMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2H1v16h18V2H3Zm0 2h14v12H3V4Zm18 2v14H5v2h18V6h-2ZM7 8H5v6h2V8Zm2-2h2v8H9V6Zm6 4h-2v4h2v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChartMultiple;
