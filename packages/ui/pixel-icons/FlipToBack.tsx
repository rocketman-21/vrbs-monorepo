import { SVGProps } from "react";

const SvgFlipToBack = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 3H7v2h2V3Zm0 12H7v2h2v-2Zm2-12h2v2h-2V3Zm2 12h-2v2h2v-2Zm2-12h2v2h-2V3Zm2 12h-2v2h2v-2Zm2-12h2v2h-2V3Zm2 4h-2v2h2V7ZM7 7h2v2H7V7Zm14 4h-2v2h2v-2ZM7 11h2v2H7v-2Zm14 4h-2v2h2v-2ZM3 7h2v12h12v2H3V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFlipToBack;
