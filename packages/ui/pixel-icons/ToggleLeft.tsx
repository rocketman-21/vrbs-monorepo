import { SVGProps } from "react";

const SvgToggleLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5h16v2H4V5Zm0 12H2V7h2v10Zm16 0v2H4v-2h16Zm0 0h2V7h-2v10ZM10 9H6v6h4V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgToggleLeft;
