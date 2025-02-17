import { SVGProps } from "react";

const SvgMailArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 4H2v16h10v-2H4V6h16v6h2V4h-2ZM6 8h2v2H6V8Zm4 4H8v-2h2v2Zm4 0v2h-4v-2h4Zm2-2v2h-2v-2h2Zm0 0V8h2v2h-2Zm8 8h-2v-2h-2v-2h-2v2h2v2h-6v2h6v2h-2v2h2v-2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMailArrowRight;
