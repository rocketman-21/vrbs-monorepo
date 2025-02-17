import { SVGProps } from "react";

const SvgContactPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h22v11h-2V5H2v14h12v2H0V3h2Zm8 4H6v4h4V7Zm-6 6h8v4H4v-4Zm16-6h-6v2h6V7Zm-6 4h6v2h-6v-2Zm3 4h-3v2h3v-2Zm4 6v3h-2v-3h-3v-2h3v-3h2v3h3v2h-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgContactPlus;
