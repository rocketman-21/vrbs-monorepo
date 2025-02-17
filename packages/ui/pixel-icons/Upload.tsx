import { SVGProps } from "react";

const SvgUpload = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 5V3h2v2h2v2h2v2h-2V7h-2v10h-2V7H9v2H7V7h2V5h2ZM3 15v6h18v-6h-2v4H5v-4H3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUpload;
