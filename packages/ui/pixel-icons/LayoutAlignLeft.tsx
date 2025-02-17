import { SVGProps } from "react";

const SvgLayoutAlignLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 16V8H8v8h12Zm-10-6h8v4h-8v-4ZM4 20h2V4H4v16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutAlignLeft;
