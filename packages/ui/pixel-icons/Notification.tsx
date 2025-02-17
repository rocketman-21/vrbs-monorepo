import { SVGProps } from "react";

const SvgNotification = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 4V2h-4v2H5v2h14V4h-5Zm5 12H5v-4H3v6h5v4h2v-4h4v2h-4v2h6v-4h5v-6h-2V6h-2v8h2v2ZM5 6v8h2V6H5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotification;
