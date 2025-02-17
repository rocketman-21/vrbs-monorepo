import { SVGProps } from "react";

const SvgArtText = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 7h10v10H2V7Zm8 8V9H4v6h6Zm12-8h-8v2h8V7Zm-8 4h8v2h-8v-2Zm8 4h-8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArtText;
