import { SVGProps } from "react";

const SvgLayoutAlignRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 8v8h12V8H4Zm10 6H6v-4h8v4Zm6-10h-2v16h2V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutAlignRight;
