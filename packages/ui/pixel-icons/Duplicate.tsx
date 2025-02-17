import { SVGProps } from "react";

const SvgDuplicate = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3h12v4h4v14H7v-4H3V3h2Zm10 4V5H5v10h2V7h8ZM9 17v2h10V9H9v8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDuplicate;
