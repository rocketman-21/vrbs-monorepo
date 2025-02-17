import { SVGProps } from "react";

const SvgClipboard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h6v2h4v18H4V4h4V2h2Zm6 4v2H8V6H6v14h12V6h-2Zm-2 0V4h-4v2h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClipboard;
