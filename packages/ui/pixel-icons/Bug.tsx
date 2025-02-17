import { SVGProps } from "react";

const SvgBug = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 2h2v4h4V2h2v4h2v3h2v2h-2v2h4v2h-4v2h2v2h-2v3H6v-3H4v-2h2v-2H2v-2h4v-2H4V9h2V6h2V2Zm8 6H8v3h8V8Zm-5 5H8v7h3v-7Zm2 7h3v-7h-3v7Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 9H2V7h2v2ZM4 19v2H2v-2h2ZM20 19h2v2h-2v-2ZM20 9V7h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBug;
