import { SVGProps } from "react";

const SvgSpeedSlow = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 5h6v2H9V5Zm10 4h-4V7h4v2Zm2 2h-2V9h2v2Zm0 6v-6h2v6h-2Zm0 0v2h-2v-2h2ZM1 11h2v6H1v-6Zm2 6h2v2H3v-2Zm11-4h-4v-2H8V9H6V7H4v2h2v2h2v2h2v4h4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSpeedSlow;
