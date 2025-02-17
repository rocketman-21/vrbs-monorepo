import { SVGProps } from "react";

const Svg4K = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 7h2v4h4V7h2v10H9v-4H3V7Zm10 0h2v4h2v2h-2v4h-2V7Zm6 8h-2v-2h2v2Zm0 0h2v2h-2v-2Zm0-6h-2v2h2V9Zm0 0V7h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default Svg4K;
