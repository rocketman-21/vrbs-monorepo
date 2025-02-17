import { SVGProps } from "react";

const SvgEyeClosed = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 7h2v2H0V7Zm4 4H2V9h2v2Zm4 2v-2H4v2H2v2h2v-2h4Zm8 0H8v2H6v2h2v-2h8v2h2v-2h-2v-2Zm4-2h-4v2h4v2h2v-2h-2v-2Zm2-2v2h-2V9h2Zm0 0V7h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEyeClosed;
