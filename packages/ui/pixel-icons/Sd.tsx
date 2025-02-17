import { SVGProps } from "react";

const SvgSd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 2h2v20H4V6h2v14h12V4H8V2h10ZM8 4H6v2h2V4Zm6 2h2v4h-2V6Zm-2 0h-2v4h2V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSd;
