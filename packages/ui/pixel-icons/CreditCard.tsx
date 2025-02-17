import { SVGProps } from "react";

const SvgCreditCard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h16v2H4v2h16v4H4v6h16v2H2V4h2Zm18 0h-2v16h2V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCreditCard;
