import { SVGProps } from "react";

const SvgRemoveBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v18h18V3H5Zm14 2v14H5V5h14Zm-3 6H8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgRemoveBox;
