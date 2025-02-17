import { SVGProps } from "react";

const SvgBuildings = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h14v4h6v16H2V2Zm18 6h-4v2h2v2h-2v2h2v2h-2v2h2v2h2V8Zm-6-4H4v16h2v-2h6v2h2V4ZM6 6h2v2H6V6Zm6 0h-2v2h2V6Zm-6 4h2v2H6v-2Zm6 0h-2v2h2v-2Zm-6 4h2v2H6v-2Zm6 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBuildings;
