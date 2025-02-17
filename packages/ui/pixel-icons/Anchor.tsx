import { SVGProps } from "react";

const SvgAnchor = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 3h-4v2H8v4h2v2h1v8H6v-4h2v-2H4v6h2v2h12v-2h2v-6h-4v2h2v4h-5v-8h1V9h2V5h-2V3Zm0 2v4h-4V5h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAnchor;
