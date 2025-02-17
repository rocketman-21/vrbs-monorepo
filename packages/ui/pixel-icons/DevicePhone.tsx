import { SVGProps } from "react";

const SvgDevicePhone = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 3h12v18H6V3Zm10 16V5h-2v2h-4V5H8v14h8Zm-5-4h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDevicePhone;
