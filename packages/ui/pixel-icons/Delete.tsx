import { SVGProps } from "react";

const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 5H7v2H5v2H3v2H1v2h2v2h2v2h2v2h16V5h-2ZM7 17v-2H5v-2H3v-2h2V9h2V7h14v10H7Zm8-6h-2V9h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2Zm0 0V9h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDelete;
