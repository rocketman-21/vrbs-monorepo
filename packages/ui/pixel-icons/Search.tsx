import { SVGProps } from "react";

const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2h8v2H6V2ZM4 6V4h2v2H4Zm0 8H2V6h2v8Zm2 2H4v-2h2v2Zm8 0v2H6v-2h8Zm2-2h-2v2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2Zm0-8h2v8h-2V6Zm0 0V4h-2v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSearch;
