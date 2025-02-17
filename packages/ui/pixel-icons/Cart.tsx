import { SVGProps } from "react";

const SvgCart = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h4v4h16v11H4V4H2V2Zm4 13h14V8H6v7Zm0 4h3v3H6v-3Zm14 0h-3v3h3v-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCart;
