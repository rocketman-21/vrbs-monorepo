import { SVGProps } from "react";

const SvgSortAlpabetic = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 2h2v2h-2V2Zm0 2v2H9V4h2Zm2 0h2v2h-2V4ZM9 18v2h2v2h2v-2h2v-2h-2v2h-2v-2H9ZM8 8H2v8h2v-2h2v2h2V8Zm-2 4H4v-2h2v2Zm6-1v-1h2v1h-2Zm4-3h-6v8h6V8Zm-4 6v-1h2v1h-2Zm10-6h-4v8h4v-2h-2v-4h2V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSortAlpabetic;
