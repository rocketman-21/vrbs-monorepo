import { SVGProps } from "react";

const SvgMessageClock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 2H2v20h2V4h16v4h2V2h-2ZM8 16H6v2H4v2h2v-2h2v-2Zm6-2h2v2h2v2h-4v-4Zm6-4h-8v2h-2v8h2v2h8v-2h2v-8h-2v-2Zm0 2v8h-8v-8h8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageClock;
