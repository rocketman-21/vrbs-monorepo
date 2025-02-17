import { SVGProps } from "react";

const SvgChartBar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 5h2v14h-2V5Zm-2 4H9v10h2V9Zm-4 4H5v6h2v-6Zm12 0h-2v6h2v-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChartBar;
