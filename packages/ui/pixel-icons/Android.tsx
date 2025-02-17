import { SVGProps } from "react";

const SvgAndroid = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h2v2H2V5Zm4 4H4V7h2v2Zm2 0H6v2H4v2H2v6h20v-6h-2v-2h-2V9h2V7h2V5h-2v2h-2v2h-2V7H8v2Zm0 0h8v2h2v2h2v4H4v-4h2v-2h2V9Zm2 4H8v2h2v-2Zm4 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAndroid;
