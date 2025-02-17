import { SVGProps } from "react";

const SvgLock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2H9v2H7v4H4v14h16V8h-3V4h-2V2Zm0 2v4H9V4h6Zm-6 6h9v10H6V10h3Zm4 3h-2v4h2v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLock;
