import { SVGProps } from "react";

const SvgImage = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3H2v18h20V3H4Zm16 2v14H4V5h16Zm-6 4h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2V9ZM8 7H6v2h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImage;
