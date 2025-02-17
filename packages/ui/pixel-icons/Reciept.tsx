import { SVGProps } from "react";

const SvgReciept = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2h2v2h2v2H5v14h14V6h-2V4h2V2h2v20H3V2Zm12 2V2h2v2h-2Zm-2 0h2v2h-2V4Zm-2 0V2h2v2h-2ZM9 4h2v2H9V4Zm0 0V2H7v2h2Zm8 4H7v2h10V8ZM7 12h10v2H7v-2Zm10 6v-2h-4v2h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgReciept;
