import { SVGProps } from "react";

const SvgAlignRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5h16v2H4V5Zm8 4h8v2h-8V9Zm-8 4v2h16v-2H4Zm8 4h8v2h-8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAlignRight;
