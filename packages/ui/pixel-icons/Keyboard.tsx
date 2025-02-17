import { SVGProps } from "react";

const SvgKeyboard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3H3v18h18V3ZM5 19V5h14v14H5ZM9 7H7v2h2V7Zm8 8H7v2h10v-2Zm-2-8h2v2h-2V7Zm-2 0h-2v2h2V7Zm-6 4h2v2H7v-2Zm10 0h-2v2h2v-2Zm-6 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgKeyboard;
