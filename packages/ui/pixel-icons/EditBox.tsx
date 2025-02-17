import { SVGProps } from "react";

const SvgEditBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 2h-2v2h2V2ZM4 4h6v2H4v14h14v-6h2v8H2V4h2Zm4 8H6v6h6v-2h2v-2h-2v2H8v-4Zm4-2h-2v2H8v-2h2V8h2V6h2v2h-2v2Zm2-6h2v2h-2V4Zm4 0h2v2h2v2h-2v2h-2v2h-2v-2h2V8h2V6h-2V4Zm-4 8h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEditBox;
