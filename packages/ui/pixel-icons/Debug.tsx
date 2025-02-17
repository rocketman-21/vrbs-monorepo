import { SVGProps } from "react";

const SvgDebug = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2h2v2H6V2ZM10 11h4v2h-4v-2ZM14 15h-4v2h4v-2Z"
      fill="currentColor"
    />
    <path
      d="M16 4h-2v2h-4V4H8v2H6v3H4V7H2v2h2v2h2v2H2v2h4v2H4v2H2v2h2v-2h2v3h12v-3h2v2h2v-2h-2v-2h-2v-2h4v-2h-4v-2h2V9h2V7h-2v2h-2V6h-2V4ZM8 20V8h8v12H8Z"
      fill="currentColor"
    />
    <path fillRule="evenodd" clipRule="evenodd" d="M16 4V2h2v2h-2Z" fill="currentColor" />
  </svg>
);

export default SvgDebug;
