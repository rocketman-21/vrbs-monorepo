import { SVGProps } from "react";

const SvgImageDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 3H2v18h20V11h-2v8H4V5h10V3ZM6 7h2v2H6V7Zm14-2h-2V3h-2v2h2v2h-2v2h2V7h2v2h2V7h-2V5Zm0 0V3h2v2h-2Zm-8 4h2v2h-2V9Zm-2 4v-2h2v2h-2Zm-2 2h2v-2H8v2Zm0 0v2H6v-2h2Zm8-2h-2v-2h2v2Zm0 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageDelete;
