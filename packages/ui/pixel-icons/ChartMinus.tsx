import { SVGProps } from "react";

const SvgChartMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 3H3v18h18V11h-2v8H5V5h8V3Zm-6 8h2v6H7v-6Zm6-4h-2v10h2V7Zm2 6h2v4h-2v-4Zm6-8h-6v2h6V5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChartMinus;
