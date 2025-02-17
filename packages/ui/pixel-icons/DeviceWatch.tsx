import { SVGProps } from "react";

const SvgDeviceWatch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2h8v4h5v12h-5v4H8v-4H3V6h5V2ZM5 16h14V8H5v8Zm6-6h2v2h2v2h-4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeviceWatch;
