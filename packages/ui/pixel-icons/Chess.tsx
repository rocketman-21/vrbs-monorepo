import { SVGProps } from "react";

const SvgChess = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h20v20H2V2Zm2 2v4h4v4H4v4h4v4h4v-4h4v4h4v-4h-4v-4h4V8h-4V4h-4v4H8V4H4Zm8 8H8v4h4v-4Zm0-4v4h4V8h-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChess;
