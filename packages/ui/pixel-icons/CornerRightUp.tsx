import { SVGProps } from "react";

const SvgCornerRightUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 18V8h2V6h-2V4h-2v2h-2v2h2v10H4v2h12v-2ZM12 8h-2v2h2V8Zm6 0h2v2h-2V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerRightUp;
