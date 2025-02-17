import { SVGProps } from "react";

const SvgTruck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h14v4h4v2h-4v6h6v-4h2v6h-4v2h-4v-2H8v2H4v-2H0V4h2Zm20 8h-2v-2h2v2Zm-8-2V6H2v10h12v-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTruck;
