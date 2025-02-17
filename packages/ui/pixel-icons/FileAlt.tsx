import { SVGProps } from "react";

const SvgFileAlt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 22H3V2h12v2h2v2h2v2h2v14ZM17 6h-2v2h2V6ZM5 4v16h14V10h-6V4H5Zm8 12H7v2h6v-2Zm-6-4h10v2H7v-2Zm4-4H7v2h4V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileAlt;
