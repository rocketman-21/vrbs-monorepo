import { SVGProps } from "react";

const SvgMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 2H2v20h2V4h16v12H6v2H4v2h2v-2h16V2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessage;
