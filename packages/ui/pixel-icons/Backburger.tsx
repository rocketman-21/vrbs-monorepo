import { SVGProps } from "react";

const SvgBackburger = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 7h10v2H11V7Zm-8 4h2V9h2v2h14v2H7v2H5v-2H3v-2Zm4 4v2h2v-2H7Zm0-6V7h2v2H7Zm14 6H11v2h10v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBackburger;
