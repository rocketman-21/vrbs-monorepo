import { SVGProps } from "react";

const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 2v4h6v2h-2v14H4V8H2V6h6V2h8Zm-2 2h-4v2h4V4Zm0 4H6v12h12V8h-4Zm-5 2h2v8H9v-8Zm6 0h-2v8h2v-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTrash;
