import { SVGProps } from "react";

const SvgSortNumeric = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2h-2v2H9v2h2V4h2v2h2V4h-2V2ZM2 8h4v8H4v-6H2V8Zm6 0h6v5h-4v1h4v2H8v-5h4v-1H8V8Zm12 0h-4v2h4v1h-4v2h4v1h-4v2h6V8h-2Zm-9 10v2H9v-2h2Zm2 2h-2v2h2v-2Zm0 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSortNumeric;
