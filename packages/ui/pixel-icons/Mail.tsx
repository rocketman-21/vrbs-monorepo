import { SVGProps } from "react";

const SvgMail = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 4H2v16h20V4ZM4 18V6h16v12H4ZM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMail;
