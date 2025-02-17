import { SVGProps } from "react";

const SvgDevices = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h16v6h4v14H12v-6H2V2Zm14 6V4H4v10h8V8h4Zm-6-2H6v2h4V6Zm10 14V10h-6v10h6Zm-4-4h2v2h-2v-2ZM6 10h4v2H6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDevices;
