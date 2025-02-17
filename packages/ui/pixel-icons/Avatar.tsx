import { SVGProps } from "react";

const SvgAvatar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 16V5H5v14h14ZM14 7h-4v4h4V7Zm1 6H9v2H7v2h2v-2h6v2h2v-2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAvatar;
