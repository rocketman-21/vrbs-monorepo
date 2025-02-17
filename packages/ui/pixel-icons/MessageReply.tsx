import { SVGProps } from "react";

const SvgMessageReply = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h18v20h-2V4H4v12h14v2h2v2h-2v-2H2V2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageReply;
