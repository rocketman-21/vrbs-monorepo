import { SVGProps } from "react";

const SvgUnlink = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 4h-2v16h2V4ZM4 6h5v2H4v8h5v2H2V6h2Zm11 0h7v12h-7v-2h5V8h-5V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUnlink;
