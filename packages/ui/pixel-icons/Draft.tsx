import { SVGProps } from "react";

const SvgDraft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2h-4v2H8v2H6v2H4v2H2v12h20V10h-2V8h-2V6h-2V4h-2V2Zm0 2v2h2v2h2v4h-2v2h-2v2h-4v-2H8v-2H6V8h2V6h2V4h4Zm-8 8v2h2v2h2v2h4v-2h2v-2h2v-2h2v8H4v-8h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDraft;
