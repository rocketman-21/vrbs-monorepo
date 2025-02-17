import { SVGProps } from "react";

const SvgAnimation = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2H2v12h2V4h10V2H4Zm2 4h12v2H8v10H6V6Zm4 4h12v12H10V10Zm10 10v-8h-8v8h8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAnimation;
