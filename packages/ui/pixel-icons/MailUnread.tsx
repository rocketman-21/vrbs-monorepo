import { SVGProps } from "react";

const SvgMailUnread = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 2h-6v6h6V2ZM4 4h10v2H4v12h16v-8h2v10H2V4h2Zm4 4H6v2h2v2h2v2h4v-2h2v-2h-2v2h-4v-2H8V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMailUnread;
