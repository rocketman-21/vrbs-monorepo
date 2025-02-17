import { SVGProps } from "react";

const SvgImagePlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3h10v2H4v14h16v-8h2v10H2V3h2Zm10 6h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2V9ZM8 7H6v2h2V7Zm10-4h2v2h2v2h-2v2h-2V7h-2V5h2V3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImagePlus;
