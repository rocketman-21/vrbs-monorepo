import { SVGProps } from "react";

const SvgChecklist = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 4h2v2h-2V4Zm-2 4V6h2v2h-2Zm-2 0h2v2h-2V8Zm0 0h-2V6h2v2ZM3 6h8v2H3V6Zm8 10H3v2h8v-2Zm7 2v-2h2v-2h-2v2h-2v-2h-2v2h2v2h-2v2h2v-2h2Zm0 0v2h2v-2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChecklist;
