import { SVGProps } from "react";

const SvgCreditCardMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 3h16v2H3v2h14v4H3v4h14v2H1V3Zm18 0h-2v14h2V3ZM5 19h16v2H5v-2ZM23 7h-2v14h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCreditCardMultiple;
