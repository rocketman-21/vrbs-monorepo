import { SVGProps } from "react";

const SvgTextSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 4H4v2h16V4Zm0 4H4v2h16V8Zm-8 4H4v2h8v-2Zm8 0h-6v6h6v2h2v-2h-2v-6Zm-4 4v-2h2v2h-2Zm-4 0H4v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTextSearch;
