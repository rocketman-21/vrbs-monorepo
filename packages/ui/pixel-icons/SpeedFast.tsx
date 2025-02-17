import { SVGProps } from "react";

const SvgSpeedFast = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 5H9v2H5v2H3v2H1v6h2v2h2v-2H3v-6h2V9h4V7h6V5Zm8 6h-2v6h-2v2h2v-2h2v-6Zm-13 2h4v4h-4v-4Zm6-2h-2v2h2v-2Zm2-2v2h-2V9h2Zm0 0V7h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSpeedFast;
