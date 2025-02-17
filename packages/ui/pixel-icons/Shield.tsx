import { SVGProps } from "react";

const SvgShield = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 2H2v12h2V4h16v10h2V2ZM6 14H4v2h2v-2Zm0 2h2v2h2v2H8v-2H6v-2Zm4 4v2h4v-2h2v-2h-2v2h-4Zm10-6h-2v2h-2v2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgShield;
