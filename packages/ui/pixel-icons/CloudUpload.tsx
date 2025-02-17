import { SVGProps } from "react";

const SvgCloudUpload = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 4h6v2h-6V4ZM8 8V6h2v2H8Zm-4 2V8h4v2H4Zm-2 2v-2h2v2H2Zm0 6H0v-6h2v6Zm0 0h7v2H2v-2ZM18 8h-2V6h2v2Zm4 4h-4V8h2v2h2v2Zm0 6v-6h2v6h-2Zm0 0v2h-7v-2h7ZM11 9h2v2h2v2h2v2h-4v5h-2v-5H7v-2h2v-2h2V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCloudUpload;
