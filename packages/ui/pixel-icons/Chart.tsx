import { SVGProps } from "react";

const SvgChart = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v18h18V3H5Zm14 2v14H5V5h14ZM9 11H7v6h2v-6Zm2-4h2v10h-2V7Zm6 6h-2v4h2v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChart;
