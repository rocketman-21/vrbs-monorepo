import { SVGProps } from "react";

const SvgShip = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 4v2h4v2H6v2h6V8h2v2h8v6h-2v-4H4v6h14v-2h2v2h4v2H0v-2h2v-8h2V6h2V4h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgShip;
