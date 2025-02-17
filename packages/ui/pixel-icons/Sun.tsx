import { SVGProps } from "react";

const SvgSun = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 3h-2v2h2V3Zm4 2h2v2h-2V5Zm-6 6h2v2h-2v-2Zm-8 0h2v2H3v-2Zm18 0h-2v2h2v-2ZM5 5h2v2H5V5Zm14 14h-2v-2h2v2Zm-8 2h2v-2h-2v2Zm-4-2H5v-2h2v2ZM9 7h6v2H9V7Zm0 8H7V9h2v6Zm0 0v2h6v-2h2V9h-2v6H9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSun;
