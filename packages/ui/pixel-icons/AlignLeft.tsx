import { SVGProps } from "react";

const SvgAlignLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 5H4v2h16V5Zm-8 4H4v2h8V9Zm8 4v2H4v-2h16Zm-8 4H4v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAlignLeft;
