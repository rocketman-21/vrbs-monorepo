import { SVGProps } from "react";

const SvgDeviceTablet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2H4v20h16V2H6Zm12 2v16H6V4h12Zm-5 12h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeviceTablet;
