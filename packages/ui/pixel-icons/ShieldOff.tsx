import { SVGProps } from "react";

const SvgShieldOff = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2h14v12h-2V4H8V2ZM2 8h2v6H2V8Zm2 6h2v2H4v-2Zm4 2H6v2h2v2h2v2h4v-2h-4v-2H8v-2Zm10 0h-2v2h2v2h2v2h2v-2h-2v-2h-2v-2ZM4 2H2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2V8H8V6H6V4H4V2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgShieldOff;
