import { SVGProps } from "react";

const SvgTextAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 4H3v2h16V4Zm0 4H3v2h16V8ZM3 12h8v2H3v-2Zm8 4H3v2h8v-2Zm7-1h3v2h-3v3h-2v-3h-3v-2h3v-3h2v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTextAdd;
