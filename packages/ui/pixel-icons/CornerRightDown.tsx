import { SVGProps } from "react";

const SvgCornerRightDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 6v10h2v2h-2v2h-2v-2h-2v-2h2V6H4V4h12v2Zm-4 10h-2v-2h2v2Zm6 0h2v-2h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerRightDown;
