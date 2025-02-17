import { SVGProps } from "react";

const SvgCornerLeftUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 18V8H6V6h2V4h2v2h2v2h-2v10h10v2H8v-2Zm4-10h2v2h-2V8ZM6 8H4v2h2V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerLeftUp;
