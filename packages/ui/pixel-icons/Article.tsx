import { SVGProps } from "react";

const SvgArticle = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v18h18V3H5Zm14 2v14H5V5h14Zm-2 2H7v2h10V7ZM7 11h10v2H7v-2Zm7 4H7v2h7v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArticle;
