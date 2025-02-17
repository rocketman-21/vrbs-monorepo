import { SVGProps } from "react";

const SvgArrowBarUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6h16V4H4v2Zm7 14h2v-8h2v2h2v-2h-2v-2h-2V8h-2v2H9v2H7v2h2v-2h2v8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowBarUp;
