import { SVGProps } from "react";

const SvgArticleMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 1H1v18h18V1H3Zm14 2v14H3V3h14Zm4 18H5v2h18V5h-2v16ZM15 5H5v2h10V5ZM5 9h10v2H5V9Zm7 4H5v2h7v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArticleMultiple;
