import { SVGProps } from "react";

const SvgDeviceLaptop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4H4v12h16V4H6Zm12 2v8H6V6h12Zm4 12H2v2h20v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeviceLaptop;
