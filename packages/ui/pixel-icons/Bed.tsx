import { SVGProps } from "react";

const SvgBed = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 4h2v12h10V8h10v2h-8v6h8v-6h2v10h-2v-2H2v2H0V4Zm3 5h2v4H3V9Zm6 4v2H5v-2h4Zm0-4h2v4H9V9Zm0 0H5V7h4v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBed;
