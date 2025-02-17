import { SVGProps } from "react";

const SvgAt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h16v12H8V8h8v6h2V6H6v12h14v2H4V4Zm10 10v-4h-4v4h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAt;
