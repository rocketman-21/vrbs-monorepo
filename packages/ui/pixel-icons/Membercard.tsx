import { SVGProps } from "react";

const SvgMembercard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v14h-7v3h-2v-2h-2v2H9v-3H2V3Zm2 2v4h16V5H4Zm16 8H4v2h16v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMembercard;
