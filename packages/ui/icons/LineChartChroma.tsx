import { SVGProps } from "react";

const SvgChartChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M15 10a.999.999 0 1 1-2 0V3a1 1 0 1 1 2 0v7Zm-6 0a.999.999 0 1 1-2 0V5a.999.999 0 1 1 2 0v5Zm-3 0a.999.999 0 1 1-2 0V8a.999.999 0 1 1 2 0v2Zm5-4c.553 0 1 .447 1 1v3a.999.999 0 1 1-2 0V7c0-.553.447-1 1-1Z"
      fill="#2F80ED"
    />
    <path
      opacity={0.4}
      d="M1 1a1 1 0 0 1 1 1v10.5a.5.5 0 0 0 .5.5H15a.999.999 0 1 1 0 2H2.5A2.5 2.5 0 0 1 0 12.5V2a1 1 0 0 1 1-1Z"
      fill="#2F80ED"
    />
  </svg>
);

export default SvgChartChroma;
