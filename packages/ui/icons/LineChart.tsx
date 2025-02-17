import { SVGProps } from "react";

const SvgLineChart = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10.4 10h1.2c.2 0 .4-.2.4-.4V5.4c0-.2-.2-.4-.4-.4h-1.2c-.2 0-.4.2-.4.4v4.2c0 .2.2.4.4.4Zm3 0h1.2c.2 0 .4-.2.4-.4V2.4c0-.2-.2-.4-.4-.4h-1.2c-.2 0-.4.2-.4.4v7.2c0 .2.2.4.4.4Zm-9 0h1.2c.2 0 .4-.2.4-.4V7.4c0-.2-.2-.4-.4-.4H4.4c-.2 0-.4.2-.4.4v2.2c0 .2.2.4.4.4Zm3 0h1.2c.2 0 .4-.2.4-.4V3.4c0-.2-.2-.4-.4-.4H7.4c-.2 0-.4.2-.4.4v6.2c0 .2.2.4.4.4Zm8.1 2H2V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V13a1 1 0 0 0 1 1h14.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLineChart;
