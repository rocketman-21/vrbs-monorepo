import { SVGProps } from "react";

const SvgOpen = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3h6v2H5v14h14v-6h2v8H3V3h2Zm8 0h8v8h-2V7h-2V5h-4V3Zm0 8h-2v2H9v2h2v-2h2v-2Zm4-4h-2v2h-2v2h2V9h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgOpen;
