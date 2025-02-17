import { SVGProps } from "react";

const SvgTimeline = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 7h4v4H7V7Zm-2 6v-2h2v2H5Zm0 0v4H1v-4h4Zm8 0h-2v-2h2v2Zm4 0h-4v4h4v-4Zm2-2v2h-2v-2h2Zm0 0h4V7h-4v4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTimeline;
