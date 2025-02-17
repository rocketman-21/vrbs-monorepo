import { SVGProps } from "react";

const SvgTeach = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2H5v4h4V2Zm7 7V7H2v9h2v6h2v-6h2v6h2V9h6Zm-5-7h11v14H11v-2h9V4h-9V2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTeach;
