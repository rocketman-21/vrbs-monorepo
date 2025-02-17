import { SVGProps } from "react";

const SvgSpeedMedium = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 5h-2v8h-1v4h4v-4h-1V5ZM9 7H5v2H3v2H1v6h2v2h2v-2H3v-6h2V9h4V7Zm12 4h2v6h-2v-6Zm-2-2h2v2h-2V9Zm0 0h-4V7h4v2Zm2 8v2h-2v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSpeedMedium;
