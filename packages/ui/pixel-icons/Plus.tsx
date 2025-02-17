import { SVGProps } from "react";

const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPlus;
