import { SVGProps } from "react";

const SvgChartDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 3H3v18h18V11h-2v8H5V5h8V3Zm-6 8h2v6H7v-6Zm6-4h-2v10h2V7Zm2 6h2v4h-2v-4Zm2-6h-2v2h2V7Zm0-2V3h-2v2h2Zm2 0h-2v2h2v2h2V7h-2V5Zm0 0V3h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChartDelete;
