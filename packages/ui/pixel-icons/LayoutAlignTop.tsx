import { SVGProps } from "react";

const SvgLayoutAlignTop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 20H8V8h8v12Zm-6-10v8h4v-8h-4Zm10-6v2H4V4h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutAlignTop;
