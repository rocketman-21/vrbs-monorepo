import { SVGProps } from "react";

const SvgDeviceTv = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 20h20V6h-7V4h-2v2h-2V4H9v2H2v14ZM9 4V2H7v2h2Zm6 0h2V2h-2v2Zm5 4v10H4V8h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeviceTv;
