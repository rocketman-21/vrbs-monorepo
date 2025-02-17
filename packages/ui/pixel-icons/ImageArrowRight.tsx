import { SVGProps } from "react";

const SvgImageArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 1h-2v2h2v2h-6v2h6v2h-2v2h2V9h2V7h2V5h-2V3h-2V1Zm-8 2H2v18h20v-8h-2v6H4V5h7V3Zm1 8V9h2v2h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2H8Zm0 0v2H6v-2h2Zm8-2h-2v-2h2v2Zm0 0h2v2h-2v-2ZM6 7h2v2H6V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageArrowRight;
