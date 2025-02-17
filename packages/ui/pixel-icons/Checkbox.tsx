import { SVGProps } from "react";

const SvgCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v18h18V3H5Zm0 2h14v14H5V5Zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheckbox;
