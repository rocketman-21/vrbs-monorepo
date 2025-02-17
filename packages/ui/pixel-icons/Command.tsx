import { SVGProps } from "react";

const SvgCommand = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2H2v8h2V2Zm16 0h2v8h-2V2Zm-6 6h-4V2H4v2h4v4H4v2h4v4H4v2h4v4H4v2h6v-6h4v6h2v-6h4v-2h-4v-4h4V8h-4V2h-2v6Zm-4 6v-4h4v4h-4ZM20 2h-4v2h4V2ZM2 14h2v8H2v-8Zm14 6h4v2h-4v-2Zm6-6h-2v8h2v-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCommand;
