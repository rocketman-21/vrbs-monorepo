import { SVGProps } from "react";

const SvgContact = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3H0v18h24V3H2Zm20 2v14H2V5h20ZM10 7H6v4h4V7Zm-6 6h8v4H4v-4Zm16-6h-6v2h6V7Zm-6 4h6v2h-6v-2Zm6 4h-6v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgContact;
