import { SVGProps } from "react";

const SvgPercent = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 4h-2v2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h2V4Zm-4 10h4v6h-6v-6h2Zm2 4v-2h-2v2h2ZM6 4h4v6H4V4h2Zm2 4V6H6v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPercent;
