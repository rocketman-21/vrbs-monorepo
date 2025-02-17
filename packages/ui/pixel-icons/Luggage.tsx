import { SVGProps } from "react";

const SvgLuggage = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2h6v4h4v14h-2v2h-2v-2H9v2H7v-2H5V6h4V2Zm2 4h2V4h-2v2ZM7 18h10V8H7v10Zm4-8v6H9v-6h2Zm4 0v6h-2v-6h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLuggage;
