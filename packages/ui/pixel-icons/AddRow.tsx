import { SVGProps } from "react";

const SvgAddRow = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 2v10H2V2h2v8h4V2h2v8h4V2h2v8h4V2h2Zm-9 17v3h-2v-3H8v-2h3v-3h2v3h3v2h-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddRow;
