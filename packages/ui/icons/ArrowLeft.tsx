import { SVGProps } from "react";

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m17.1 11.32-11.224-.005 3.127 3.128c.48.48.479 1.264 0 1.744-.48.48-1.264.48-1.744 0L2.032 10.96a1.244 1.244 0 0 1 0-1.743l5.233-5.232c.48-.48 1.264-.48 1.743 0a1.235 1.235 0 0 1 0 1.742l-3.131 3.13 11.216-.004c.68 0 1.229.549 1.228 1.228.017.68-.54 1.238-1.22 1.239z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowLeft;
