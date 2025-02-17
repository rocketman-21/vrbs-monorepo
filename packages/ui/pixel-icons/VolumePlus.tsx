import { SVGProps } from "react";

const SvgVolumePlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h2v20h-2v-2H8v-2h2V6H8V4h2V2ZM6 8V6h2v2H6Zm0 8H2V8h4v2H4v4h2v2Zm0 0v2h2v-2H6Zm13-5h3v2h-3v3h-2v-3h-3v-2h3V8h2v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVolumePlus;
