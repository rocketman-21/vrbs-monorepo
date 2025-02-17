import { SVGProps } from "react";

const SvgCreditCardPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h18v2H4v2h16v4H4v6h10v2H2V4Zm20 0h-2v8h2V4Zm-4 10h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCreditCardPlus;
