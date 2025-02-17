import { SVGProps } from "react";

const SvgDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 17V3h-2v10H9v-2H7v2h2v2h2v2h2Zm8 2v-4h-2v4H5v-4H3v6h18v-2Zm-8-6v2h2v-2h2v-2h-2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDownload;
