import { SVGProps } from "react";

const SvgDrop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2h-2v2H9v4H7v4H5v6h2v2h2v2h6v-2h2v-2h2v-6h-2V8h-2V4h-2V2Zm0 2v4h2v4h2v6h-2v2H9v-2H7v-6h2V8h2V4h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDrop;
