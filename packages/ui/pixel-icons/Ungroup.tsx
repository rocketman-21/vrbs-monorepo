import { SVGProps } from "react";

const SvgUngroup = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3H3v4h4V3Zm0 14H3v4h4v-4ZM17 3h4v4h-4V3Zm4 14h-4v4h4v-4ZM8 8h2v2H8V8Zm4 2h-2v4H8v2h2v-2h4v2h2v-2h-2v-4h2V8h-2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUngroup;
