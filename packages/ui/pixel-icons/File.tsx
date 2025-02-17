import { SVGProps } from "react";

const SvgFile = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 22h18V8h-2V6h-2v2h-2V6h2V4h-2V2H3v20Zm2-2V4h8v6h6v10H5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFile;
