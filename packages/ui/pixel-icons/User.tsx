import { SVGProps } from "react";

const SvgUser = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2H9v2H7v6h2V4h6V2Zm0 8H9v2h6v-2Zm0-6h2v6h-2V4ZM4 16h2v-2h12v2H6v4h12v-4h2v6H4v-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUser;
