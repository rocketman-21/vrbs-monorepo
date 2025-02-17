import { SVGProps } from "react";

const SvgCardId = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h20v16H2V4Zm2 2v4h16V6H4Zm16 6H10v2h10v-2Zm0 4h-4v2h4v-2Zm-6 2v-2H4v2h10ZM4 14h4v-2H4v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCardId;
