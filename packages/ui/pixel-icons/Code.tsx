import { SVGProps } from "react";

const SvgCode = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 5h2v2H8V5ZM6 7h2v2H6V7ZM4 9h2v2H4V9ZM2 11h2v2H2v-2ZM4 13h2v2H4v-2ZM6 15h2v2H6v-2ZM8 17h2v2H8v-2ZM16 5h-2v2h2V5ZM18 7h-2v2h2V7ZM20 9h-2v2h2V9ZM22 11h-2v2h2v-2ZM20 13h-2v2h2v-2ZM18 15h-2v2h2v-2ZM16 17h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCode;
