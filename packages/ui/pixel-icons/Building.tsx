import { SVGProps } from "react";

const SvgBuilding = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2h18v20H3V2Zm12 16v2h4V4H5v16h4v-2h6ZM7 6h2v2H7V6Zm6 0h-2v2h2V6Zm2 0h2v2h-2V6Zm-6 4H7v2h2v-2Zm2 0h2v2h-2v-2Zm6 0h-2v2h2v-2ZM7 14h2v2H7v-2Zm6 0h-2v2h2v-2Zm4 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBuilding;
