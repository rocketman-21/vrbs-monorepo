import { SVGProps } from "react";

const SvgCard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h20v16H2V4Zm18 14V6H4v12h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCard;
